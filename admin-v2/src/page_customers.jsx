function PageCustomers({ t, lang }) {
  const I = window.Icons;
  const { CUSTOMERS, ORDERS } = window.MAD_DATA;
  const [search, setSearch] = React.useState('');
  const [segmentFilter, setSegmentFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(null);

  const withSegments = CUSTOMERS.map(c => {
    const segment = c.spent >= 5000 ? 'vip' : c.orders >= 3 ? 'returning' : 'new';
    const lastOrder = ORDERS.filter(o => o.customer === c.name).sort((a, b) => b.date.localeCompare(a.date))[0];
    return { ...c, segment, last_purchase: lastOrder?.date || '—' };
  });

  const filtered = withSegments.filter(c => {
    if (search && !(c.name + ' ' + c.email).toLowerCase().includes(search.toLowerCase())) return false;
    if (segmentFilter !== 'all' && c.segment !== segmentFilter) return false;
    return true;
  });

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('customers')}</h1>
        <p className="page-sub">{filtered.length} {lang === 'da' ? 'kunder' : 'customers'}</p>
      </div>

      <div className="filter-bar">
        <div className="search-inline">
          <I.search />
          <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {['all', 'new', 'returning', 'vip'].map(s => (
            <button key={s} className={segmentFilter === s ? 'active' : ''} onClick={() => setSegmentFilter(s)}>
              {s === 'all' ? t('all') : t('seg_' + s)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>{t('th_name')}</th>
                <th>{t('th_geography')}</th>
                <th>{t('th_segment')}</th>
                <th>{t('th_orders_count')}</th>
                <th>{t('th_ltv')}</th>
                <th>{t('th_last_purchase')}</th>
                <th>{t('th_newsletter')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.email} onClick={() => setSelected(c)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={c.name} />
                      <div>
                        <div className="bold">{c.name}</div>
                        <div className="small muted">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <I.map_pin style={{ width: 13, height: 13, color: 'var(--fg-soft)' }} />
                      <span>{c.city}</span>
                    </div>
                  </td>
                  <td><SegmentChip segment={c.segment} t={t} /></td>
                  <td className="bold">{c.orders}</td>
                  <td className="bold">{c.spent.toLocaleString('da-DK')} {t('kr')}</td>
                  <td className="mono small muted">{c.last_purchase}</td>
                  <td>
                    {c.newsletter
                      ? <Chip kind="ok">✓</Chip>
                      : <Chip kind="muted">—</Chip>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <CustomerDetail customer={selected} onClose={() => setSelected(null)} t={t} lang={lang} />}
    </div>
  );
}

function SegmentChip({ segment, t }) {
  const map = {
    vip: { cls: 'warn', icon: '★' },
    returning: { cls: 'ok', icon: '↻' },
    new: { cls: 'muted', icon: '◎' },
  };
  const { cls, icon } = map[segment] || map.new;
  return <span className={`chip ${cls}`}>{icon} {t('seg_' + segment)}</span>;
}

function CustomerAvatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <span style={{
      width: 30, height: 30, borderRadius: '50%',
      background: 'var(--gold-soft)', color: 'var(--gold)',
      display: 'inline-grid', placeItems: 'center',
      fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.01em', flexShrink: 0
    }}>{initials}</span>
  );
}

function CustomerDetail({ customer, onClose, t, lang }) {
  const I = window.Icons;
  const { ORDERS } = window.MAD_DATA;
  const customerOrders = ORDERS.filter(o => o.customer === customer.name);
  const [notes, setNotes] = React.useState(customer.notes);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div className="flex items-center gap-3">
            <CustomerAvatar name={customer.name} />
            <div>
              <div className="small muted">{t('customer_profile')}</div>
              <h2 style={{ margin: '4px 0 0', fontSize: 20, letterSpacing: '-0.02em' }}>{customer.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SegmentChip segment={customer.segment} t={t} />
            <button className="icon-btn" onClick={onClose}><I.x /></button>
          </div>
        </div>
        <div className="panel-body">

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div className="card">
              <div className="small muted">{t('total_orders')}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{customer.orders}</div>
            </div>
            <div className="card">
              <div className="small muted">{t('th_ltv')}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {customer.spent.toLocaleString('da-DK')}
              </div>
              <div className="small muted">{t('kr')}</div>
            </div>
            <div className="card">
              <div className="small muted">{t('avg_order_value')}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {Math.round(customer.spent / Math.max(customer.orders, 1))}
              </div>
              <div className="small muted">{t('kr')}</div>
            </div>
          </div>

          <h4 style={{ margin: '0 0 10px', fontSize: 13 }}>{t('contact')}</h4>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="kv-row"><span className="kv-k">{t('th_email')}</span><span className="kv-v">{customer.email}</span></div>
            <div className="kv-row"><span className="kv-k">{t('th_phone')}</span><span className="kv-v mono small">{customer.phone}</span></div>
            <div className="kv-row"><span className="kv-k">{t('th_newsletter')}</span><span className="kv-v">{customer.newsletter ? '✓' : '—'}</span></div>
          </div>

          <h4 style={{ margin: '0 0 10px', fontSize: 13 }}>{t('address')}</h4>
          <div className="card" style={{ marginBottom: 20 }}>
            <div>{customer.address}</div>
            <div className="small muted">Danmark</div>
          </div>

          <h4 style={{ margin: '0 0 10px', fontSize: 13 }}>{t('order_history')}</h4>
          <div className="card" style={{ padding: 0, marginBottom: 20 }}>
            {customerOrders.length > 0 ? customerOrders.map((o, i) => (
              <div key={o.no} className="flex items-center between" style={{
                padding: '12px 14px',
                borderBottom: i < customerOrders.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <div className="bold mono small">{o.no}</div>
                  <div className="small muted">{o.date} · {o.items} {lang === 'da' ? 'varer' : 'items'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bold">{o.amount} {t('kr')}</span>
                  <StatusChip status={o.status} t={t} />
                </div>
              </div>
            )) : (
              <div className="small muted" style={{ padding: 14, textAlign: 'center' }}>
                {lang === 'da' ? 'Ingen tidligere ordrer' : 'No previous orders'}
              </div>
            )}
          </div>

          <h4 style={{ margin: '0 0 10px', fontSize: 13 }}>{t('admin_notes')}</h4>
          <textarea className="textarea" rows="4" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={lang === 'da' ? 'Tilføj en note…' : 'Add a note…'} style={{ marginBottom: 20 }} />

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-secondary"><I.mail />{t('send_email')}</button>
              <button className="btn btn-secondary"><I.download />{t('export_data')}</button>
              <button className="btn btn-secondary" style={{ color: 'var(--err)', marginLeft: 'auto' }} onClick={() => setConfirmDelete(true)}>
                <I.trash />{t('delete_customer')}
              </button>
            </div>
          </div>
        </div>

        {confirmDelete && (
          <Modal
            title={t('gdpr_delete_title')}
            onClose={() => setConfirmDelete(false)}
            onConfirm={() => { setConfirmDelete(false); onClose(); }}
            confirmLabel={t('confirm_delete')}
            cancelLabel={t('cancel')}
            danger>
            {t('gdpr_delete_body')}
          </Modal>
        )}
      </div>
    </div>
  );
}

window.PageCustomers = PageCustomers;
