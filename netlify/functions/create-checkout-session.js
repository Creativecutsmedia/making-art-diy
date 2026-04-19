const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BASE_URL = 'https://makingartdiy.dk';
const MAX_CART_ITEMS = 20;
const MAX_QTY_PER_ITEM = 10;

const DEFAULT_SHIPPING = {
  flat_cost_dkk: 49,
  free_threshold_dkk: 500,
  delivery_min_business_days: 3,
  delivery_max_business_days: 7,
};

async function loadCatalogue() {
  const [productsRes, shippingRes] = await Promise.all([
    fetch(`${BASE_URL}/products.json`),
    fetch(`${BASE_URL}/shipping-config.json`),
  ]);
  if (!productsRes.ok) throw new Error(`products.json fetch failed: ${productsRes.status}`);
  const products = await productsRes.json();
  const shipping = shippingRes.ok ? await shippingRes.json() : DEFAULT_SHIPPING;
  return {
    productsBySlug: Object.fromEntries(products.map(p => [p.slug, p])),
    shipping,
  };
}

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

  let productsBySlug, shipping;
  try {
    ({ productsBySlug, shipping } = await loadCatalogue());
  } catch (err) {
    console.error('Catalogue load error:', err);
    return jsonResponse(500, { error: 'Could not load product catalogue' });
  }

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
    return jsonResponse(500, {
      error: 'Payment session could not be created',
      debug: { type: err.type, code: err.code, message: err.message }
    });
  }
};
