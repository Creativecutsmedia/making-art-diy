// Products listing
function PageProducts({ t, lang, navigate }) {
  const I = window.Icons;
  const { data: products, loading, error, refresh } = useProducts();
  const { data: stats } = useStats();
  const soldBySku = (stats && stats.sold_by_sku) || {};
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [visibility, setVisibility] = React.useState('all');

  const list = products || [];
  const filtered = list.filter(p => {
    const name = (lang === 'da' ? p.name_da : p.name_en).toLowerCase();
    if (search && !name.includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'all' && p.category !== category) return false;
    if (visibility === 'visible' && !p.visible) return false;
    if (visibility === 'hidden' && p.visible) return false;
    return true;
  });

  return (
    <div className="content">
      <div className="page-header flex between items-center">
        <div>
          <h1 className="page-title">{t('products')}</h1>
          <p className="page-sub">
            {loading ? '…' : `${filtered.length} ${lang === 'da' ? 'varer' : 'products'}`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('edit_product', { new: true })}>
          <I.plus />{t('new_product').replace('+ ', '')}
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-inline">
          <I.search />
          <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {['all', 'voksne', 'born', 'erhverv'].map(c => (
            <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
              {c === 'all' ? t('all') : t('cat_' + c)}
            </button>
          ))}
        </div>
        <div className="seg">
          {[{id:'all',l:t('all')},{id:'visible',l:t('visible_yes')},{id:'hidden',l:t('visible_no')}].map(o => (
            <button key={o.id} className={visibility === o.id ? 'active' : ''} onClick={() => setVisibility(o.id)}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-soft)' }}>
            {lang === 'da' ? 'Indlæser produkter…' : 'Loading products…'}
          </div>
        )}
        {!loading && error && (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ color: 'var(--err)', marginBottom: 12 }}>
              {lang === 'da' ? 'Kunne ikke loade produkter' : 'Could not load products'}: {error}
            </div>
            <button className="btn btn-secondary" onClick={refresh}>
              {lang === 'da' ? 'Prøv igen' : 'Retry'}
            </button>
          </div>
        )}
        {!loading && !error && list.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-soft)' }}>
            {lang === 'da' ? 'Ingen produkter oprettet endnu.' : 'No products yet.'}
          </div>
        )}
        {!loading && !error && list.length > 0 && filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-soft)' }}>
            {lang === 'da' ? 'Ingen produkter matcher filtrene.' : 'No products match the filters.'}
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('th_sku')}</th>
                  <th></th>
                  <th>{t('th_product')}</th>
                  <th>{t('th_price')}</th>
                  <th>{t('th_category')}</th>
                  <th>{t('th_files')}</th>
                  <th>{t('th_sold')}</th>
                  <th>{t('th_visible')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.sku} onClick={() => navigate('edit_product', { sku: p.sku })}>
                    <td className="sku-cell">{p.sku}</td>
                    <td><Thumb src={p.image} alt={lang === 'da' ? p.name_da : p.name_en} /></td>
                    <td><span className="bold">{lang === 'da' ? p.name_da : p.name_en}</span></td>
                    <td>{p.price} {t('kr')}</td>
                    <td><CategoryChip category={p.category} t={t} /></td>
                    <td className="mono">{p.files}</td>
                    <td className="bold">{soldBySku[p.sku] ?? '—'}</td>
                    <td>
                      {p.visible
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ok)' }}>
                            <I.eye /> <span className="small">{t('visible_yes')}</span>
                          </span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-soft)' }}>
                            <I.eye_off /> <span className="small">{t('visible_no')}</span>
                          </span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

window.PageProducts = PageProducts;
