const Stripe = require('stripe');
const { Resend } = require('resend');
const products = require('../../products.json');
const { buildOrderEmail } = require('./lib/order-email');
const { orderReferenceFromSessionId } = require('./lib/order-reference');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = 'https://makingartdiy.dk';

const productsBySlug = Object.fromEntries(products.map(p => [p.slug, p]));

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

function getRawBody(event) {
  if (!event.body) return '';
  return event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
}

function maskEmail(email) {
  if (!email || typeof email !== 'string') return '(ingen)';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  return `${user.slice(0, 2)}***@${domain}`;
}

function stripeDashboardUrl(sessionId) {
  const isTest = sessionId.startsWith('cs_test_');
  const prefix = isTest ? 'test/' : '';
  return `https://dashboard.stripe.com/${prefix}checkout/sessions/${sessionId}`;
}

async function sendAlertEmail(resend, { orderRef, customerEmail, sessionId, totalCents, locale, errorMessage }) {
  const totalKr = (totalCents / 100).toFixed(2);
  const body = [
    `Ordre-bekræftelsesmail kunne ikke sendes til kunden.`,
    ``,
    `Ordre-ref:      #${orderRef}`,
    `Kundens email:  ${customerEmail}`,
    `Session ID:     ${sessionId}`,
    `Total:          ${totalKr} kr (${totalCents} øre)`,
    `Locale:         ${locale}`,
    `Fejl:           ${errorMessage}`,
    ``,
    `Stripe Dashboard: ${stripeDashboardUrl(sessionId)}`,
    ``,
    `Betalingen er gennemført. Send manuelt en bekræftelse til kunden,`,
    `eller gensend via Resend dashboard.`,
  ].join('\n');

  const result = await resend.emails.send({
    from: 'Making Art DIY <info@makingartdiy.dk>',
    to: 'makingartdiy@gmail.com',
    subject: `[ALERT] Ordre-email fejlede — #${orderRef}`,
    text: body,
  });
  if (result.error) throw new Error(result.error.message || 'unknown');
}

async function handleCheckoutSessionCompleted(stripeEvent) {
  const sessionId = stripeEvent.data.object.id;
  const orderRef = orderReferenceFromSessionId(sessionId);

  console.log(`[webhook] checkout.session.completed session=${sessionId} ref=${orderRef}`);

  const [session, lineItemsList] = await Promise.all([
    stripe.checkout.sessions.retrieve(sessionId),
    stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      expand: ['data.price.product'],
    }),
  ]);

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name || session.shipping_details?.name || null;
  const locale = session.metadata?.locale === 'en' ? 'en' : 'da';

  if (!customerEmail) {
    console.error(`[webhook] no customer email — ref=${orderRef} session=${sessionId}`);
    return jsonResponse(200, { received: true, skipped: 'no-email' });
  }

  const unknownProductLabel = locale === 'en' ? '(unknown product)' : '(ukendt produkt)';

  const items = lineItemsList.data.map(li => {
    const slug = li.price?.product?.metadata?.slug;
    const product = slug ? productsBySlug[slug] : null;
    const imageUrl = product?.image ? BASE_URL + product.image : null;
    return {
      name: li.price?.product?.name || li.description || unknownProductLabel,
      quantity: li.quantity || 1,
      priceCents: li.price?.unit_amount ?? 0,
      imageUrl,
    };
  });

  const subtotalCents = session.amount_subtotal ?? 0;
  const shippingCents = session.shipping_cost?.amount_total
    ?? session.total_details?.amount_shipping
    ?? 0;
  const totalCents = session.amount_total ?? 0;

  const addr = session.shipping_details?.address;
  const shippingAddress = addr ? {
    name: session.shipping_details?.name || null,
    line1: addr.line1 || '',
    line2: addr.line2 || null,
    postal_code: addr.postal_code || '',
    city: addr.city || '',
    country: addr.country || '',
  } : null;

  const { subject, html, text } = buildOrderEmail({
    orderRef,
    customerName,
    items,
    subtotalCents,
    shippingCents,
    totalCents,
    shippingAddress,
    locale,
  });

  console.log(`[webhook] sending email to=${maskEmail(customerEmail)} ref=${orderRef} locale=${locale} items=${items.length} total=${totalCents}`);

  const resend = new Resend(process.env.RESEND_API_KEY);

  let emailError = null;
  try {
    const result = await resend.emails.send({
      from: 'Making Art DIY <info@makingartdiy.dk>',
      to: customerEmail,
      bcc: 'makingartdiy@gmail.com',
      replyTo: 'info@makingartdiy.dk',
      subject,
      html,
      text,
    });
    if (result.error) {
      emailError = new Error(result.error.message || 'unknown');
    } else {
      console.log(`[webhook] email sent ref=${orderRef} resend_id=${result.data?.id || '(none)'}`);
      return jsonResponse(200, { received: true, emailId: result.data?.id });
    }
  } catch (err) {
    emailError = err;
  }

  console.error('ORDER_EMAIL_FAILED', {
    orderRef, customerEmail, sessionId, locale, error: emailError.message,
  });

  try {
    await sendAlertEmail(resend, {
      orderRef, customerEmail, sessionId, totalCents, locale,
      errorMessage: emailError.message,
    });
  } catch (alertErr) {
    console.error('ALERT_EMAIL_FAILED', {
      orderRef, sessionId, error: alertErr.message,
    });
  }

  return jsonResponse(200, { received: true, emailError: emailError.message });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const rawBody = getRawBody(event);

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message);
    return jsonResponse(400, { error: 'Invalid signature' });
  }

  console.log(`[webhook] verified event type=${stripeEvent.type} id=${stripeEvent.id}`);

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      return await handleCheckoutSessionCompleted(stripeEvent);
    }
    console.log(`[webhook] ignoring event type=${stripeEvent.type}`);
    return jsonResponse(200, { received: true, ignored: stripeEvent.type });
  } catch (err) {
    console.error(`[webhook] handler error event=${stripeEvent.id}:`, err);
    return jsonResponse(500, { error: 'Webhook handler failed' });
  }
};
