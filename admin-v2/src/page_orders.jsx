// Ordrestyring — full order management
const { useState: useStateOM, useMemo: useMemoOM } = React;

const PAY_CHIPS = {
  cc: 'gold', mobilepay: 'blue', bank: 'purple',
  cash: 'green-pm', barter: 'grey-pm', free: 'pink-pm'
};
const STATUS_CHIPS = {
  new: 'chip-new', production: 'chip-production', ready: 'chip-ready',
  shipped: 'chip-shipped', delivered: 'chip-delivered',
  cancelled: 'chip-cancelled', refunded: 'chip-refunded'
};
const FRAGT_ICONS = {
  none: '·', qr_pending: 'qr', dropped_off: 'box',
  in_transit: 'truck', delivered: 'check'
};

function PayChip({ method, t }) {
  return <span className={`chip ${PAY_CHIPS[method]}`}>{t('pay_' + method)}</span>;
}
function StatusChipFull({ status, t }) {
  return <span className={`chip ${STATUS_CHIPS[status]}`}>{t('status_' + status)}</span>;
}
function FragtIcon({ status, t }) {
  const I = window.Icons;
  if (status === 'none') return <span className="muted small">—</span>;
  const map = {
    qr_pending: { icon: <I.qr />, color: 'var(--gold)' },
    dropped_off: { icon: <I.box />, color: 'var(--fg-mute)' },
    in_transit: { icon: <I.truck />, color: '#6fa3d6' },
    delivered: { icon: <I.check />, color: 'var(--ok)' },
  };
  const m = map[status];
  return <span title={t('fr_' + status)} style={{ color: m.color, display: 'inline-flex', alignItems: 'center' }}>
    {m.icon}
  </span>;
}

function PageOrders({ t, lang, navigate }) {
  const I = window.Icons;
  const { ORDERS } = window.MAD_DATA;
  const [view, setView] = useStateOM(null); // order obj for detail
  const [showManual, setShowManual] = useStateOM(false);
  const [q, setQ] = useStateOM('');
  const [statusF, setStatusF] = useStateOM('all');
  const [payF, setPayF] = useStateOM('all');
  const [dateF, setDateF] = useStateOM('30');
  const [revOnly, setRevOnly] = useStateOM(false);
  const [checked, setChecked] = useStateOM(new Set());

  const filtered = useMemoOM(() => ORDERS.filter(o => {
    if (q && !`${o.no} ${o.customer} ${o.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusF !== 'all' && o.status !== statusF) return false;
    if (payF !== 'all' && o.payment !== payF) return false;
    if (revOnly && o.payment !== 'cc') return false;
    return true;
  }), [ORDERS, q, statusF, payF, revOnly]);

  // Stats: CC only, today=2026-04-21
  const ccOrders = ORDERS.filter(o => o.payment === 'cc');
  const newToday = ccOrders.filter(o => o.date.startsWith('2026-04-21') && o.status === 'new').length;
  const inProd = ccOrders.filter(o => o.status === 'production').length;
  const readyCount = ccOrders.filter(o => o.status === 'ready').length;
  const shippedWeek = ccOrders.filter(o => {
    const d = new Date(o.date);
    return (new Date('2026-04-21') - d) < 7 * 86400000 && o.status === 'shipped';
  }).length;

  if (view) return <OrderDetailFull order={view} onBack={() => setView(null)} t={t} lang={lang} navigate={navigate} />;

  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set());
    else setChecked(new Set(filtered.map(o => o.no)));
  };
  const toggle = (no) => {
    const n = new Set(checked);
    n.has(no) ? n.delete(no) : n.add(no);
    setChecked(n);
  };

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('orders')}</h1>
        <p className="page-sub">{t('om_sub')}</p>
      </div>

      {/* Stat cards — CC only */}
      <div className="stats-grid" style={{ marginBottom: 18 }}>
        <StatCard icon={<I.bolt />} label={t('om_stat_new_today')} value={newToday} trend={t('om_cc_only_hint')} trendDir="up" trendLabel="" />
        <StatCard icon={<I.gear />} label={t('om_stat_production')} value={inProd} trend={t('om_cc_only_hint')} trendDir="up" trendLabel="" />
        <StatCard icon={<I.box />} label={t('om_stat_ready')} value={readyCount} trend={t('om_cc_only_hint')} trendDir="up" trendLabel="" />
        <StatCard icon={<I.truck />} label={t('om_stat_shipped_week')} value={shippedWeek} trend={t('om_cc_only_hint')} trendDir="up" trendLabel="" />
      </div>

      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowManual(true)}>
          <I.plus />{t('create_manual_order')}
        </button>
        <button className="btn btn-secondary"><I.download />{t('export_csv')}</button>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--fg-soft)' }}><I.search /></span>
            <input className="input" placeholder={lang === 'da' ? 'Ordrenr., kunde, email…' : 'Order #, customer, email…'}
              value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="input" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">{t('all')}</option>
            {['new','production','ready','shipped','delivered','cancelled','refunded'].map(s =>
              <option key={s} value={s}>{t('status_' + s)}</option>)}
          </select>
          <select className="input" value={payF} onChange={e => setPayF(e.target.value)}>
            <option value="all">{t('pay_all')}</option>
            {['cc','mobilepay','bank','cash','barter','free'].map(p =>
              <option key={p} value={p}>{t('pay_' + p)}</option>)}
          </select>
          <div className="seg">
            {['today','7','30'].map(d => (
              <button key={d} className={dateF === d ? 'active' : ''} onClick={() => setDateF(d)}>
                {t('date_' + d)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex between items-center">
          <label className="flex items-center gap-2" style={{ fontSize: 13, cursor: 'pointer' }}>
            <Toggle on={revOnly} onChange={setRevOnly} />
            <span className="bold">{t('only_revenue')}</span>
            <span className="info-tip" data-tip={t('revenue_cc_tooltip')}>i</span>
          </label>
          {checked.size > 0 && (
            <div className="flex gap-2 items-center">
              <span className="small muted">{checked.size} {t('selected_n')}</span>
              <button className="btn btn-ghost small-btn">{t('bulk_production')}</button>
              <button className="btn btn-ghost small-btn">{t('bulk_create_qr')}</button>
              <button className="btn btn-ghost small-btn">{t('bulk_shipped')}</button>
              <button className="btn btn-ghost small-btn"><I.printer />{t('bulk_print')}</button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" checked={checked.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll} />
                </th>
                <th>{t('th_order')}</th>
                <th>{t('th_date')}</th>
                <th>{t('th_customer')}</th>
                <th>{t('th_items')}</th>
                <th>{t('th_amount')}</th>
                <th>{t('th_payment')}</th>
                <th>{t('th_status')}</th>
                <th>{t('fragt_status_col')}</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const rowCls = (o.payment === 'free' || o.payment === 'barter') ? 'row-' + o.payment : '';
                const itemsTxt = `${o.items.reduce((s,i)=>s+i.qty,0)} ${lang === 'da' ? 'varer' : 'items'}`;
                return (
                  <tr key={o.no} className={rowCls} onClick={() => setView(o)}>
                    <td onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={checked.has(o.no)} onChange={() => toggle(o.no)} />
                    </td>
                    <td className="sku-cell bold">
                      {o.no}
                      {o.manual && <span className="manual-badge" title={t('manual_badge')}>M</span>}
                    </td>
                    <td className="mono small muted">{o.date.slice(0,10)}</td>
                    <td>
                      <div className="bold">{o.customer}</div>
                      <div className="small muted">{o.city}</div>
                    </td>
                    <td title={o.items.map(i => `${i.qty}× ${lang === 'da' ? i.name_da : i.name_en}`).join('\n')}>
                      {itemsTxt}
                    </td>
                    <td className="bold">{o.amount} {t('kr')}</td>
                    <td><PayChip method={o.payment} t={t} /></td>
                    <td><StatusChipFull status={o.status} t={t} /></td>
                    <td><FragtIcon status={o.fragt_status} t={t} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="icon-btn small-btn"><I.more /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showManual && <ManualOrderModal onClose={() => setShowManual(false)} t={t} lang={lang} />}
    </div>
  );
}

window.PageOrders = PageOrders;
window.StatusChipFull = StatusChipFull;
window.PayChip = PayChip;
window.FragtIcon = FragtIcon;
