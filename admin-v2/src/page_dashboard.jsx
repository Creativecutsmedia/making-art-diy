function formatRevenueDKK(cents, t) {
  if (cents == null) return '—';
  const kroner = Math.round(cents / 100);
  return `${kroner.toLocaleString('da-DK')} ${t('kr')}`;
}

// Month-name lookup (indexed via month - 1)
const MONTH_DA = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Maps products.json `category` field → i18n key + donut color.
// Unknown categories fall back to the category name and a neutral grey.
const CATEGORY_META = {
  'Voksne':  { tKey: 'cat_voksne',  color: '#C9963A' },
  'Børn':    { tKey: 'cat_born',    color: '#6fa3d6' },
  'Erhverv': { tKey: 'cat_erhverv', color: '#a78bd4' },
};
const CATEGORY_FALLBACK_COLOR = '#999';

// Enhanced Dashboard
function PageDashboard({ t, lang, navigate }) {
  const I = window.Icons;
  const { data: stats, loading, error, refresh } = useStats();
  const { PRODUCTS, ORDERS, ACTIVITY, DK_CITIES } = window.MAD_DATA;
  const topProducts = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const ready = ORDERS.filter(o => o.payment === 'cc' && (o.status === 'new' || o.status === 'production')).slice(0, 4);

  // Manual orders last 30 days by payment method
  const manualCounts = {};
  ORDERS.filter(o => o.manual).forEach(o => {
    manualCounts[o.payment] = (manualCounts[o.payment] || 0) + 1;
  });
  const manualList = Object.entries(manualCounts);

  // Bar-chart data: derive from stats.sales_6m. Show placeholder if missing or all zero.
  const sales6m = stats?.sales_6m;
  const barChartEmpty = !sales6m?.length || sales6m.every(m => m.count === 0);
  const barChartData = barChartEmpty ? [] : sales6m.map(m => ({
    label: (lang === 'da' ? MONTH_DA : MONTH_EN)[m.month - 1],
    value: m.count,
  }));

  // Donut-categories data: map sales_by_category object → chart-ready array.
  // Empty in Stripe Test mode until Live-switch (SKU metadata gap).
  const salesByCategory = stats?.sales_by_category;
  const donutEmpty = !salesByCategory || Object.keys(salesByCategory).length === 0;
  const donutData = donutEmpty ? [] : Object.entries(salesByCategory).map(([cat, frac]) => {
    const meta = CATEGORY_META[cat];
    return {
      label: meta ? t(meta.tKey) : cat,
      value: Math.round(frac * 100),
      color: meta ? meta.color : CATEGORY_FALLBACK_COLOR,
    };
  });

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('welcome')}</h1>
        <p className="page-sub">{t('welcome_sub')}</p>
      </div>

      <Callout icon={<I.bolt />} title={t('low_revenue_title')}
        actionLabel={lang === 'da' ? 'Opret kampagne' : 'Create campaign'}
        onAction={() => navigate('discounts')}>
        {t('low_revenue_sub')}
      </Callout>

      {error && (
        <div style={{
          marginTop: 20,
          padding: 16,
          border: '1px solid var(--err)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ color: 'var(--err)' }}>
            {lang === 'da' ? 'Kunne ikke loade statistik' : 'Could not load stats'}: {error}
          </div>
          <button className="btn btn-secondary" onClick={refresh}>
            {lang === 'da' ? 'Prøv igen' : 'Retry'}
          </button>
        </div>
      )}

      <div className="stats-grid" style={{ marginTop: 20 }}>
        <StatCard icon={<I.box />} label={t('stat_products')} value={stats?.stats?.products_count ?? '—'} />
        <StatCard icon={<I.cart />} label={t('stat_orders')} value={stats?.stats?.orders_count_30d ?? '—'} />
        <StatCard icon={<I.dollar />} label={<span>{t('stat_revenue')}<span className="info-tip" data-tip={t('revenue_cc_tooltip')}>i</span></span>} value={formatRevenueDKK(stats?.stats?.revenue_cents_30d, t)} />
        <StatCard icon={<I.users />} label={t('stat_customers')} value={stats?.stats?.customers_count ?? '—'} />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('sales_6m')}</h3>
            <span className="card-sub">{t('order_count_label')}</span>
          </div>
          {barChartEmpty ? (
            <div style={{
              height: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--fg-mute)',
              fontSize: 13,
            }}>
              {loading ? '—' : t('no_sales_data')}
            </div>
          ) : (
            <BarChart data={barChartData} labelKey="label" valueKey="value" height={260} />
          )}
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">{t('sales_cat')}</h3></div>
          <div className="donut-wrap">
            <DonutChart data={donutData} centerLabel={stats?.stats?.orders_count_30d ?? '—'} centerSub={t('orders_unit')} />
            {donutEmpty ? (
              !loading && (
                <div className="donut-legend" style={{ color: 'var(--fg-mute)', fontSize: 13, fontStyle: 'italic' }}>
                  {t('category_data_pending')}
                </div>
              )
            ) : (
              <div className="donut-legend">
                {donutData.map((d, i) => (
                  <div key={i} className="donut-item">
                    <span className="donut-swatch" style={{ background: d.color }}/>
                    <span className="donut-item-label">{d.label}</span>
                    <span className="donut-item-val">{d.value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly goal + DK map */}
      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('monthly_goal')}</h3>
            <span className="card-sub">{t('monthly_goal_sub')}</span>
          </div>
          <div className="ring-wrap" style={{ padding: '20px 0' }}>
            <ProgressRing value={4820} max={10000} size={180} thickness={16} label="48%" sub={`4.820 / 10.000 ${t('kr')}`} />
            <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--fg-mute)', maxWidth: 280 }}>
              {lang === 'da' ? '9 dage tilbage af måneden — du er lidt bagud, men fortsat inden for rækkevidde.' : '9 days left in the month — slightly behind, still within reach.'}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('customer_map')}</h3>
            <span className="card-sub">{DK_CITIES.reduce((s, c) => s + c.orders, 0)} {t('orders_unit')}</span>
          </div>
          <DKMap cities={DK_CITIES} />
          <div className="small muted" style={{ marginTop: 10, display: 'flex', gap: 12 }}>
            <span className="flex items-center gap-2"><span className="status-dot ok" /> {lang === 'da' ? 'Prik-størrelse = antal ordrer' : 'Dot size = number of orders'}</span>
          </div>
        </div>
      </div>

      {/* Ready for production + Manual orders */}
      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">{t('ready_production')}</h3>
              <div className="card-sub">{t('ready_production_sub')} <span className="chip gold" style={{ marginLeft: 6 }}>{t('pay_cc')}</span></div>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('orders')}>{t('view_all')}</button>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>{t('th_order')}</th>
                <th>{t('th_customer')}</th>
                <th>{t('th_items')}</th>
                <th>{t('th_amount')}</th>
              </tr>
            </thead>
            <tbody>
              {ready.map(o => {
                const days = Math.max(0, Math.floor((new Date('2026-04-21') - new Date(o.date)) / 86400000));
                const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
                return (
                  <tr key={o.no} onClick={() => navigate('orders')}>
                    <td className="sku-cell bold">{o.no}</td>
                    <td className="bold">{o.customer}</td>
                    <td>{itemCount}</td>
                    <td className="flex between items-center gap-2">
                      <span className="bold">{o.amount} {t('kr')}</span>
                      <span className="chip warn">{days} {t('days_ago')}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">{t('manual_orders_30d')}</h3>
              <div className="card-sub">{t('manual_orders_30d_sub')}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('orders')}>{t('view_all')}</button>
          </div>
          <table className="data">
            <thead><tr><th>{t('th_payment')}</th><th>{t('th_orders_count')}</th><th></th></tr></thead>
            <tbody>
              {manualList.map(([method, count]) => (
                <tr key={method}>
                  <td><PayChip method={method} t={t} /></td>
                  <td className="bold">{count} {t('orders_unit')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ width: 80, height: 6, background: 'var(--input-bg)', borderRadius: 3, display: 'inline-block', overflow: 'hidden' }}>
                      <div style={{ width: `${(count / Math.max(...manualList.map(([,c]) => c))) * 100}%`, height: '100%', background: 'var(--gold)' }}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity — own row */}
      <div className="card">
        <div className="card-head"><h3 className="card-title">{t('recent_activity')}</h3></div>
        <ActivityFeed items={ACTIVITY} lang={lang} limit={6} />
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-title">{t('top_products')}</h3>
          <button className="btn btn-primary" onClick={() => navigate('add_product')}><I.plus />{t('new_product').replace('+ ', '')}</button>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>{t('th_sku')}</th><th></th><th>{t('th_product')}</th><th>{t('th_price')}</th>
                <th>{t('th_category')}</th><th>{t('th_sold')}</th><th>{t('th_status')}</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(p => (
                <tr key={p.sku} onClick={() => navigate('edit_product', { sku: p.sku })}>
                  <td className="sku-cell">{p.sku}</td>
                  <td><Thumb kind={p.thumb} /></td>
                  <td><span className="bold">{lang === 'da' ? p.name_da : p.name_en}</span></td>
                  <td>{p.price} {t('kr')}</td>
                  <td><CategoryChip category={p.category} t={t} /></td>
                  <td className="bold">{p.sold}</td>
                  <td><span className={`status-dot ${p.visible ? 'ok' : 'muted'}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.PageDashboard = PageDashboard;
