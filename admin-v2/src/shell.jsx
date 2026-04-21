// App shell: sidebar + topbar
function Sidebar({ page, setPage, t }) {
  const I = window.Icons;
  const sales = [
    { id: 'dashboard', label: t('dashboard'), icon: <I.dashboard /> },
    { id: 'products', label: t('products'), icon: <I.box /> },
    { id: 'orders', label: t('orders'), icon: <I.cart /> },
    { id: 'refunds', label: t('refunds'), icon: <I.refund /> },
    { id: 'discounts', label: t('discounts'), icon: <I.percent /> },
  ];
  const customers = [
    { id: 'customers', label: t('customers'), icon: <I.users /> },
    { id: 'newsletter', label: t('newsletter'), icon: <I.mail /> },
  ];
  const analysis = [
    { id: 'stats', label: t('stats'), icon: <I.chart /> },
    { id: 'activity_log', label: t('activity_log'), icon: <I.activity /> },
  ];
  const settings = [
    { id: 'shipping', label: t('shipping'), icon: <I.truck /> },
    { id: 'email_templates', label: t('email_templates'), icon: <I.inbox /> },
    { id: 'integrations', label: t('integrations'), icon: <I.plug /> },
    { id: 'settings', label: t('settings'), icon: <I.gear /> },
  ];

  const activeFor = (id) => page === id ||
    (id === 'products' && page === 'edit_product') ||
    (id === 'products' && page === 'add_product');

  const render = (items) => items.map(n => (
    <div key={n.id} className={`nav-item ${activeFor(n.id) ? 'active' : ''}`} onClick={() => setPage(n.id)}>
      {n.icon}<span>{n.label}</span>
    </div>
  ));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">M</div>
        <div className="sidebar-logo-text">Making Art DIY</div>
      </div>
      <SectionLabel>{t('sec_sales')}</SectionLabel>
      {render(sales)}
      <SectionLabel>{t('sec_customers')}</SectionLabel>
      {render(customers)}
      <SectionLabel>{t('sec_analysis')}</SectionLabel>
      {render(analysis)}
      <SectionLabel>{t('sec_settings')}</SectionLabel>
      {render(settings)}
    </aside>
  );
}

function Topbar({ lang, setLang, theme, setTheme, t, onOpenCmd }) {
  const I = window.Icons;
  const { NOTIFICATIONS } = window.MAD_DATA;
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  React.useEffect(() => {
    const close = () => { setNotifOpen(false); setExportOpen(false); };
    if (notifOpen || exportOpen) {
      setTimeout(() => window.addEventListener('click', close, { once: true }), 0);
    }
  }, [notifOpen, exportOpen]);

  return (
    <div className="topbar">
      <button className="cmd-trigger" onClick={onOpenCmd}>
        <I.search />
        <span className="cmd-trigger-text">{t('search')}</span>
        <span className="cmd-kbd">⌘K</span>
      </button>
      <div style={{ flex: 1 }} />

      {/* Export */}
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-secondary" onClick={() => { setExportOpen(o => !o); setNotifOpen(false); }}>
          <I.download />{t('export')}<I.chevron_down />
        </button>
        {exportOpen && (
          <div className="dropdown">
            <div className="dropdown-item"><I.box />{t('export_products_xlsx')}</div>
            <div className="dropdown-item"><I.cart />{t('export_orders_csv')}</div>
            <div className="dropdown-item"><I.users />{t('export_customers_gdpr')}</div>
          </div>
        )}
      </div>

      <div className="lang-toggle">
        <button className={lang === 'da' ? 'active' : ''} onClick={() => setLang('da')}>DA</button>
        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
      </div>
      <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <I.sun /> : <I.moon />}
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => { setNotifOpen(o => !o); setExportOpen(false); }}>
          <I.bell />
          {unread > 0 && <span className="dot" />}
        </button>
        {notifOpen && (
          <div className="dropdown dropdown-wide">
            <div className="dropdown-head">
              <span className="bold">{t('notifications')}</span>
              <button className="btn btn-ghost small-btn">{t('mark_all_read')}</button>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className={`notif ${n.unread ? 'unread' : ''}`}>
                <div className={`notif-dot notif-${n.kind}`} />
                <div className="notif-body">
                  <div className="notif-title">{lang === 'da' ? n.title_da : n.title_en}</div>
                  <div className="notif-sub">{lang === 'da' ? n.sub_da : n.sub_en}</div>
                </div>
                <div className="notif-time">{lang === 'da' ? n.when_da : n.when_en}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="avatar">MA</div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar });
