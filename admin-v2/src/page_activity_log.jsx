// Activity log
function PageActivityLog({ t, lang }) {
  const I = window.Icons;
  const { ACTIVITY_LOG } = window.MAD_DATA;
  const [actionFilter, setActionFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const types = ['all', 'order', 'product', 'customer', 'discount', 'settings', 'login'];
  const filtered = ACTIVITY_LOG.filter(a => {
    if (actionFilter !== 'all' && a.type !== actionFilter) return false;
    if (search && !(a.who + ' ' + a.text_da + ' ' + a.text_en).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const labelFor = (tp) => {
    const map = { all: t('all'), order: t('act_order_status'), product: t('act_product_updated'), customer: t('act_customer_deleted'), discount: t('act_discount_created'), settings: t('act_settings'), login: t('act_login') };
    return map[tp] || tp;
  };

  return (
    <div className="content" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">{t('activity_log')}</h1>
        <p className="page-sub">{t('activity_sub')}</p>
      </div>

      <div className="filter-bar">
        <div className="search-inline">
          <I.search />
          <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {types.map(tp => (
            <button key={tp} className={actionFilter === tp ? 'active' : ''} onClick={() => setActionFilter(tp)}>
              {labelFor(tp)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {filtered.length > 0
          ? <ActivityFeed items={filtered} lang={lang} />
          : <EmptyState icon={<I.activity />} title={t('empty_generic')} sub={lang === 'da' ? 'Prøv at ændre filtrene' : 'Try adjusting filters'} />
        }
      </div>
    </div>
  );
}

window.PageActivityLog = PageActivityLog;
