// Refunds
function PageRefunds({ t, lang }) {
  const I = window.Icons;
  const { REFUNDS } = window.MAD_DATA;
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(null);

  const filtered = REFUNDS.filter(r => statusFilter === 'all' || r.status === statusFilter);

  const chip = (s) => ({
    pending: <Chip kind="warn">{t('refund_pending')}</Chip>,
    approved: <Chip kind="ok">{t('refund_approved')}</Chip>,
    rejected: <Chip kind="err">{t('refund_rejected')}</Chip>,
  }[s]);

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('refunds')}</h1>
        <p className="page-sub">{t('refunds_sub')}</p>
      </div>

      <div className="filter-bar">
        <div className="seg">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} className={statusFilter === s ? 'active' : ''} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? t('all') : t('refund_' + s)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th><th>{t('th_order')}</th><th>{t('th_customer')}</th>
                <th>{t('th_date')}</th><th>{t('th_amount')}</th>
                <th>{t('th_reason')}</th><th>{t('th_status')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setSelected(r)}>
                  <td className="sku-cell bold">{r.id}</td>
                  <td className="sku-cell">{r.order}</td>
                  <td className="bold">{r.customer}</td>
                  <td className="mono small muted">{r.date}</td>
                  <td className="bold">{r.amount} {t('kr')}</td>
                  <td>{lang === 'da' ? r.reason_da : r.reason_en}</td>
                  <td>{chip(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="panel-overlay" onClick={() => setSelected(null)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <div className="small muted">{t('refund_detail')}</div>
                <h2 style={{ margin: '4px 0', fontSize: 22 }}>{selected.id}</h2>
                {chip(selected.status)}
              </div>
              <button className="icon-btn" onClick={() => setSelected(null)}><I.x /></button>
            </div>
            <div className="panel-body">
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="kv-row"><span className="kv-k">{t('th_order')}</span><span className="kv-v mono">{selected.order}</span></div>
                <div className="kv-row"><span className="kv-k">{t('th_customer')}</span><span className="kv-v">{selected.customer}</span></div>
                <div className="kv-row"><span className="kv-k">{t('th_date')}</span><span className="kv-v mono small">{selected.date}</span></div>
                <div className="kv-row"><span className="kv-k">{t('th_amount')}</span><span className="kv-v">{selected.amount} {t('kr')}</span></div>
                <div className="kv-row"><span className="kv-k">{t('th_reason')}</span><span className="kv-v">{lang === 'da' ? selected.reason_da : selected.reason_en}</span></div>
              </div>
              {selected.status === 'pending' && (
                <div className="flex gap-2">
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}><I.x />{t('reject')}</button>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><I.check />{t('approve')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.PageRefunds = PageRefunds;
