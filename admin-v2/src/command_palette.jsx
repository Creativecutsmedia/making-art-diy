// Command palette (Cmd+K)
function CommandPalette({ open, onClose, navigate, t, lang }) {
  const I = window.Icons;
  const { PRODUCTS, ORDERS, CUSTOMERS } = window.MAD_DATA;
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    if (open) setQ('');
  }, [open]);

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const pages = [
    { id: 'dashboard', label: t('dashboard'), icon: <I.dashboard /> },
    { id: 'products', label: t('products'), icon: <I.box /> },
    { id: 'orders', label: t('orders'), icon: <I.cart /> },
    { id: 'refunds', label: t('refunds'), icon: <I.refund /> },
    { id: 'discounts', label: t('discounts'), icon: <I.percent /> },
    { id: 'customers', label: t('customers'), icon: <I.users /> },
    { id: 'stats', label: t('stats'), icon: <I.chart /> },
    { id: 'activity_log', label: t('activity_log'), icon: <I.activity /> },
    { id: 'newsletter', label: t('newsletter'), icon: <I.mail /> },
    { id: 'email_templates', label: t('email_templates'), icon: <I.inbox /> },
    { id: 'integrations', label: t('integrations'), icon: <I.plug /> },
    { id: 'shipping', label: t('shipping'), icon: <I.truck /> },
    { id: 'settings', label: t('settings'), icon: <I.gear /> },
  ];

  const ql = q.toLowerCase();
  const matchingPages = ql ? pages.filter(p => p.label.toLowerCase().includes(ql)) : pages.slice(0, 6);
  const matchingProducts = ql
    ? PRODUCTS.filter(p => (lang === 'da' ? p.name_da : p.name_en).toLowerCase().includes(ql) || p.sku.toLowerCase().includes(ql)).slice(0, 4)
    : [];
  const matchingOrders = ql
    ? ORDERS.filter(o => o.no.toLowerCase().includes(ql) || o.customer.toLowerCase().includes(ql)).slice(0, 4)
    : [];
  const matchingCustomers = ql
    ? CUSTOMERS.filter(c => c.name.toLowerCase().includes(ql)).slice(0, 4)
    : [];

  const go = (p, params) => { navigate(p, params); onClose(); };

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-box" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <I.search />
          <input ref={inputRef} className="cmd-input" placeholder={t('cmd_search')}
            value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="cmd-kbd">ESC</span>
        </div>
        <div className="cmd-results">
          {matchingPages.length > 0 && (
            <>
              <div className="cmd-group-label">{t('cmd_pages')}</div>
              {matchingPages.map(p => (
                <div key={p.id} className="cmd-item" onClick={() => go(p.id)}>
                  {p.icon}<span>{p.label}</span>
                </div>
              ))}
            </>
          )}
          {matchingProducts.length > 0 && (
            <>
              <div className="cmd-group-label">{t('cmd_products')}</div>
              {matchingProducts.map(p => (
                <div key={p.sku} className="cmd-item" onClick={() => go('edit_product', { sku: p.sku })}>
                  <I.box /><span>{lang === 'da' ? p.name_da : p.name_en}</span>
                  <span className="cmd-item-sub">{p.sku}</span>
                </div>
              ))}
            </>
          )}
          {matchingOrders.length > 0 && (
            <>
              <div className="cmd-group-label">{t('cmd_orders')}</div>
              {matchingOrders.map(o => (
                <div key={o.no} className="cmd-item" onClick={() => go('orders')}>
                  <I.cart /><span>{o.no} · {o.customer}</span>
                  <span className="cmd-item-sub">{o.amount} kr</span>
                </div>
              ))}
            </>
          )}
          {matchingCustomers.length > 0 && (
            <>
              <div className="cmd-group-label">{t('cmd_customers')}</div>
              {matchingCustomers.map(c => (
                <div key={c.email} className="cmd-item" onClick={() => go('customers')}>
                  <I.user /><span>{c.name}</span>
                  <span className="cmd-item-sub">{c.city}</span>
                </div>
              ))}
            </>
          )}
          {ql && matchingPages.length === 0 && matchingProducts.length === 0 && matchingOrders.length === 0 && matchingCustomers.length === 0 && (
            <div className="empty" style={{ padding: 30 }}>
              <div className="muted small">{lang === 'da' ? 'Ingen resultater for' : 'No results for'} "{q}"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
