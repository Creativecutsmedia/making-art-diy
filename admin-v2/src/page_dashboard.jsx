// Enhanced Dashboard
function PageDashboard({ t, lang, navigate }) {
  const I = window.Icons;
  const { PRODUCTS, SALES_6M, ORDERS, ACTIVITY, DK_CITIES } = window.MAD_DATA;
  const chartData = SALES_6M.map(d => ({ label: lang === 'da' ? d.month_da : d.month_en, value: d.value }));
  const topProducts = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const ready = ORDERS.filter(o => o.payment === 'cc' && (o.status === 'new' || o.status === 'production')).slice(0, 4);

  // Manual orders last 30 days by payment method
  const manualCounts = {};
  ORDERS.filter(o => o.manual).forEach(o => {
    manualCounts[o.payment] = (manualCounts[o.payment] || 0) + 1;
  });
  const manualList = Object.entries(manualCounts);

  const donutData = [
    { label: t('cat_voksne'), value: 55, color: '#C9963A' },
    { label: t('cat_born'), value: 28, color: '#6fa3d6' },
    { label: t('cat_erhverv'), value: 17, color: '#a78bd4' },
  ];

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

      <div className="stats-grid" style={{ marginTop: 20 }}>
        <StatCard icon={<I.box />} label={t('stat_products')} value="12" trend="+2" trendDir="up" trendLabel={t('stat_this_week')} />
        <StatCard icon={<I.cart />} label={t('stat_orders')} value="47" trend="+12%" trendDir="up" trendLabel={t('stat_last_month')} />
        <StatCard icon={<I.dollar />} label={<span>{t('stat_revenue')}<span className="info-tip" data-tip={t('revenue_cc_tooltip')}>i</span></span>} value={`8.420 ${t('kr')}`} trend="+8%" trendDir="up" trendLabel={t('stat_last_month')} />
        <StatCard icon={<I.users />} label={t('stat_customers')} value="38" trend="−3%" trendDir="down" trendLabel={t('stat_last_month')} />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('sales_6m')}</h3>
            <span className="card-sub">{t('order_count_label')}</span>
          </div>
          <BarChart data={chartData} labelKey="label" valueKey="value" height={260} />
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">{t('sales_cat')}</h3></div>
          <div className="donut-wrap">
            <DonutChart data={donutData} centerLabel="47" centerSub={t('orders_unit')} />
            <div className="donut-legend">
              {donutData.map((d, i) => (
                <div key={i} className="donut-item">
                  <span className="donut-swatch" style={{ background: d.color }}/>
                  <span className="donut-item-label">{d.label}</span>
                  <span className="donut-item-val">{d.value}%</span>
                </div>
              ))}
            </div>
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
