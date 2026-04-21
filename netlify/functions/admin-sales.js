const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  console.log(`[admin-sales] request from user=${user.email || user.sub}`);

  try {
    const countsBySku = {};
    let sessionCount = 0;
    let paidCount = 0;

    for await (const session of stripe.checkout.sessions.list({ limit: 100 })) {
      sessionCount++;
      if (session.payment_status !== 'paid') continue;
      paidCount++;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      });

      for (const li of lineItems.data) {
        const sku = li.price && li.price.product && li.price.product.metadata
          ? li.price.product.metadata.sku
          : null;
        if (!sku) continue;
        const qty = li.quantity || 0;
        countsBySku[sku] = (countsBySku[sku] || 0) + qty;
      }
    }

    console.log(`[admin-sales] scanned sessions=${sessionCount} paid=${paidCount} skus=${Object.keys(countsBySku).length}`);

    return jsonResponse(200, {
      counts: countsBySku,
      meta: { scanned_sessions: sessionCount, paid_sessions: paidCount },
    });
  } catch (err) {
    console.error('[admin-sales] error:', err.message);
    return jsonResponse(500, { error: 'Failed to fetch sales' });
  }
};
