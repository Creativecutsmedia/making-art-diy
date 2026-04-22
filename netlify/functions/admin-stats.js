const Stripe = require('stripe');
const products = require('../../products.json');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000;
const MONTHS_LOOKBACK = 6;

const categoryBySku = Object.fromEntries(
  products.filter(p => p.sku).map(p => [p.sku, p.category])
);

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

function buildEmpty6mBuckets(now) {
  const result = [];
  for (let i = MONTHS_LOOKBACK - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    result.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      count: 0,
    });
  }
  return result;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  console.log(`[admin-stats] request from user=${user.email || user.sub}`);

  try {
    const now = new Date();
    const cutoff30dMs = now.getTime() - MS_30_DAYS;

    const sales6m = buildEmpty6mBuckets(now);
    const sales6mIndex = {};
    sales6m.forEach((b, i) => {
      sales6mIndex[b.year * 12 + (b.month - 1)] = i;
    });

    const soldBySku = {};
    const categoryCounts = {};
    const uniqueCustomerEmails = new Set();
    let revenueCents30d = 0;
    let ordersCount30d = 0;
    let scannedSessions = 0;
    let paidSessions = 0;

    for await (const session of stripe.checkout.sessions.list({ limit: 100 })) {
      scannedSessions++;
      if (session.payment_status !== 'paid') continue;
      paidSessions++;

      const createdMs = (session.created || 0) * 1000;
      const createdDate = new Date(createdMs);
      const sessionMonthKey =
        createdDate.getUTCFullYear() * 12 + createdDate.getUTCMonth();

      if (createdMs >= cutoff30dMs) {
        ordersCount30d++;
        revenueCents30d += session.amount_total || 0;
      }

      const email = session.customer_details && session.customer_details.email;
      if (email) uniqueCustomerEmails.add(email.toLowerCase());

      const bucketIdx = sales6mIndex[sessionMonthKey];
      if (bucketIdx !== undefined) sales6m[bucketIdx].count++;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      });

      for (const li of lineItems.data) {
        const sku =
          li.price && li.price.product && li.price.product.metadata
            ? li.price.product.metadata.sku
            : null;
        if (!sku) continue;
        const qty = li.quantity || 0;
        soldBySku[sku] = (soldBySku[sku] || 0) + qty;
        const cat = categoryBySku[sku];
        if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;
      }
    }

    const categoryTotal = Object.values(categoryCounts).reduce((s, n) => s + n, 0);
    const salesByCategory = {};
    for (const [cat, count] of Object.entries(categoryCounts)) {
      salesByCategory[cat] = categoryTotal > 0 ? count / categoryTotal : 0;
    }

    const result = {
      stats: {
        products_count: products.length,
        orders_count_30d: ordersCount30d,
        revenue_cents_30d: revenueCents30d,
        customers_count: uniqueCustomerEmails.size,
      },
      sold_by_sku: soldBySku,
      sales_by_category: salesByCategory,
      sales_6m: sales6m,
      meta: {
        scanned_sessions: scannedSessions,
        paid_sessions: paidSessions,
      },
    };

    console.log(
      `[admin-stats] computed scanned=${scannedSessions} paid=${paidSessions} ` +
        `30d_orders=${ordersCount30d} 30d_revenue=${revenueCents30d} ` +
        `customers=${uniqueCustomerEmails.size}`
    );

    return jsonResponse(200, result);
  } catch (err) {
    console.error('[admin-stats] error:', err.message);
    return jsonResponse(500, { error: 'Failed to fetch stats' });
  }
};
