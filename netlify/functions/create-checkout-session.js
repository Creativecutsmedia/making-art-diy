const Stripe = require('stripe');
const products = require('../../products.json');
const shipping = require('../../shipping-config.json');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BASE_URL = 'https://makingartdiy.dk';
const MAX_CART_ITEMS = 20;
const MAX_QTY_PER_ITEM = 10;

const productsBySlug = Object.fromEntries(products.map(p => [p.slug, p]));

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return jsonResponse(400, { error: 'Invalid JSON' }); }

  const items = Array.isArray(body.items) ? body.items : [];
  const locale = body.locale === 'en' ? 'en' : 'da';

  if (items.length === 0) return jsonResponse(400, { error: 'Cart is empty' });
  if (items.length > MAX_CART_ITEMS) return jsonResponse(400, { error: 'Too many items in cart' });

  const lineItems = [];
  let subtotalCents = 0;

  for (const it of items) {
    const product = productsBySlug[it.slug];
    if (!product || product.published === false) {
      return jsonResponse(400, { error: `Unknown product: ${it.slug}` });
    }
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
      return jsonResponse(400, { error: 'Invalid quantity' });
    }

    const priceCents = Math.round(Number(product.price) * 100);
    const name = (locale === 'en' ? (product.title_en || product.title) : product.title).trim();
    const images = product.image ? [BASE_URL + product.image] : [];

    lineItems.push({
      price_data: {
        currency: 'dkk',
        unit_amount: priceCents,
        product_data: {
          name,
          images,
          metadata: { slug: product.slug },
        },
      },
      quantity: qty,
    });

    subtotalCents += priceCents * qty;
  }

  const freeThresholdCents = Math.round(shipping.free_threshold_dkk * 100);
  const flatShippingCents = Math.round(shipping.flat_cost_dkk * 100);
  const shippingCents = subtotalCents >= freeThresholdCents ? 0 : flatShippingCents;

  const shippingLabel = locale === 'en'
    ? (shippingCents === 0 ? 'Free shipping' : 'Standard shipping')
    : (shippingCents === 0 ? 'Gratis fragt' : 'Standard fragt');

  const vatNote = locale === 'en'
    ? 'Prices are not subject to VAT (Danish VAT Act § 48).'
    : 'Priserne er ikke tillagt moms (jf. momslovens § 48).';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['DK'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingCents, currency: 'dkk' },
          display_name: shippingLabel,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: shipping.delivery_min_business_days },
            maximum: { unit: 'business_day', value: shipping.delivery_max_business_days },
          },
        },
      }],
      locale,
      custom_text: { submit: { message: vatNote } },
      metadata: { locale },
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel.html`,
    });

    return jsonResponse(200, { url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return jsonResponse(500, { error: 'Payment session could not be created' });
  }
};
