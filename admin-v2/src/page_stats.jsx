function PageStats({ t, lang }) {
  const I = window.Icons;
  const { SALES_12M, NEW_CUSTOMERS_12M, PRODUCTS } = window.MAD_DATA;
  const [range, setRange] = React.useState('365');

  const revenueData = SALES_12M.map(d => ({ label: lang === 'da' ? d.m_da : d.m_en, value: d.value }));
  const newCustData = NEW_CUSTOMERS_12M.map(d => ({ label: lang === 'da' ? d.m_da : d.m_en, value: d.value }));

  const top10 = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 10).map(p => ({
    label: (lang === 'da' ? p.name_da : p.name_en).slice(0, 18) + ((lang === 'da' ? p.name_da : p.name_en).length > 18 ? '…' : ''),
    value: p.sold,
  }));

  const donutData = [
    { label: t('cat_voksne'), value: 55, color: '#C9963A' },
    { label: t('cat_born'), value: 28, color: '#6fa3d6' },
    { label: t('cat_erhverv'), value: 17, color: '#a78bd4' },
  ];

  const totalRevenue = SALES_12M.reduce((s, d) => s + d.value, 0);
  const totalOrders = 284;
  const aov = Math.round(totalRevenue / totalOrders);

  return (
    <div className="content">
      <div className="page-header flex between items-center">
        <div>
          <h1 className="page-title">{t('stats')}</h1>
          <p className="page-sub">{lang === 'da' ? 'Dyk ned i dine tal' : 'Dive into your numbers'}</p>
        </div>
        <div className="seg">
          {[{id:'7',l:t('time_7')},{id:'30',l:t('time_30')},{id:'90',l:t('time_90')},{id:'365',l:t('time_365')}].map(o => (
            <button key={o.id} className={range === o.id ? 'active' : ''} onClick={() => setRange(o.id)}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard icon={<I.dollar />} label={t('avg_order_value')} value={`${aov} ${t('kr')}`} trend="+6%" trendDir="up" trendLabel={t('stat_last_month')} />
        <StatCard icon={<I.bolt />} label={t('conversion_rate')} value="3.4%" trend="+0.3pp" trendDir="up" trendLabel={t('conversion_sub')} />
        <StatCard icon={<I.refund />} label={t('returning_rate')} value="62%" trend="−2%" trendDir="down" trendLabel={t('first_time')} />
        <StatCard icon={<I.gift />} label={t('gifts_given')} value="2" trend="+1" trendDir="up" trendLabel={t('gifts_given_sub')} />
      </div>

      <div className="info-box" style={{ marginBottom: 20 }}>
        <I.info /><span>{t('stats_revenue_cc_note')}</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">{t('revenue_over_time')}</h3>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 6 }}>
              {totalRevenue.toLocaleString('da-DK')} {t('kr')}
            </div>
          </div>
          <span className="trend-pill trend-up">↑ 14%</span>
        </div>
        <LineChart data={revenueData} labelKey="label" valueKey="value" height={280} />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('top_10')}</h3>
          </div>
          <HBarChart data={top10} height={360} />
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{t('category_split')}</h3>
          </div>
          <div className="donut-wrap" style={{ marginTop: 30 }}>
            <DonutChart data={donutData} size={200} thickness={26} centerLabel="100%" centerSub={lang === 'da' ? 'ordrer' : 'orders'} />
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

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head">
          <h3 className="card-title">{t('manual_orders_chart')}</h3>
          <span className="card-sub">{t('manual_orders_30d_sub')}</span>
        </div>
        <StackedBarChart
          data={window.MAD_DATA.MANUAL_ORDERS_12M.map(d => ({ label: lang === 'da' ? d.m_da : d.m_en, ...d }))}
          labels={{ mobilepay: t('pay_mobilepay'), bank: t('pay_bank'), cash: t('pay_cash'), barter: t('pay_barter'), free: t('pay_free') }}
        />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head">
          <h3 className="card-title">{t('new_customers')}</h3>
        </div>
        <BarChart data={newCustData} labelKey="label" valueKey="value" height={240} showTrend={false} />
      </div>
    </div>
  );
}

function StackedBarChart({ data, labels }) {
  const W = 640, H = 260, pad = { t: 20, r: 16, b: 28, l: 16 };
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;
  const keys = ['mobilepay', 'bank', 'cash', 'barter', 'free'];
  const colors = { mobilepay: '#6fa3d6', bank: '#a78bd4', cash: '#6aba8a', barter: '#9e968a', free: '#d78caa' };
  const L = labels || { mobilepay: 'MobilePay', bank: 'Bankoverførsel', cash: 'Kontant', barter: 'Bytte', free: 'Gratis' };
  const max = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0))) * 1.15 || 1;
  const barW = innerW / data.length * 0.6;
  const step = innerW / data.length;
  return (
    <>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} className="grid-line" x1={pad.l} x2={W - pad.r} y1={pad.t + innerH * f} y2={pad.t + innerH * f} />
        ))}
        {data.map((d, i) => {
          const x = pad.l + step * i + step / 2 - barW / 2;
          const total = keys.reduce((s, k) => s + (d[k] || 0), 0);
          let y = pad.t + innerH;
          return (
            <g key={i}>
              {keys.map(k => {
                const v = d[k] || 0;
                if (!v) return null;
                const h = (v / max) * innerH;
                y -= h;
                return <rect key={k} x={x} y={y} width={barW} height={h} fill={colors[k]} />;
              })}
              {total > 0 && (
                <text className="axis-label" x={x + barW / 2} y={y - 5} textAnchor="middle" style={{ fontWeight: 600 }}>{total}</text>
              )}
              <text className="axis-label" x={x + barW / 2} y={H - 8} textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="stack-legend">
        {keys.map(k => (
          <span key={k}><span className="sw" style={{ background: colors[k] }} />{L[k]}</span>
        ))}
      </div>
    </>
  );
}

window.StackedBarChart = StackedBarChart;


window.PageStats = PageStats;
