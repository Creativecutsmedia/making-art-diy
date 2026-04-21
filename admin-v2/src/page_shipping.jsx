function PageShipping({ t, lang }) {
  const I = window.Icons;
  const methods = [
    { id: 'gls', name: t('carrier_gls'), price: 39, days: '1–2', active: true },
    { id: 'dao', name: t('carrier_dao'), price: 49, days: '1–2', active: true },
    { id: 'bring', name: t('carrier_bring'), price: 89, days: '2–3', active: true },
    { id: 'pickup', name: t('carrier_pickup'), price: 0, days: (lang === 'da' ? 'Efter aftale' : 'By arrangement'), active: false },
  ];
  const [state, setState] = React.useState(methods);

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('shipping')}</h1>
        <p className="page-sub">{t('shipping_desc')}</p>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('shipping_methods')}</h3>
        <p className="form-section-desc">{t('shipping_desc')}</p>

        {state.map((m, i) => (
          <div key={m.id} style={{
            display: 'grid', gridTemplateColumns: '44px 1fr auto auto auto', alignItems: 'center',
            gap: 14, padding: '14px', background: 'var(--input-bg)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-inner)',
            marginBottom: 10
          }}>
            <div className="file-icon"><I.truck /></div>
            <div>
              <div className="bold" style={{ fontSize: 14 }}>{m.name}</div>
              <div className="small muted">{lang === 'da' ? 'Leveringstid' : 'Delivery'}: {m.days} {lang === 'da' && typeof m.days === 'string' && m.days.includes('–') ? 'hverdage' : ''}</div>
            </div>
            <div className="bold">{m.price === 0 ? (lang === 'da' ? 'Gratis' : 'Free') : `${m.price} ${t('kr')}`}</div>
            <Chip kind={m.active ? 'ok' : 'muted'}>{m.active ? (lang === 'da' ? 'Aktiv' : 'Active') : (lang === 'da' ? 'Skjult' : 'Hidden')}</Chip>
            <Toggle on={m.active} onChange={(v) => setState(s => s.map((x, j) => j === i ? { ...x, active: v } : x))} />
          </div>
        ))}

        <button className="btn btn-secondary" style={{ marginTop: 8 }}>
          <I.plus />{lang === 'da' ? 'Tilføj metode' : 'Add method'}
        </button>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{lang === 'da' ? 'Fragt-zoner' : 'Shipping zones'}</h3>
        <p className="form-section-desc">{lang === 'da' ? 'Hvor du sender til' : 'Where you ship to'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { name: lang === 'da' ? 'Danmark' : 'Denmark', active: true },
            { name: lang === 'da' ? 'Norden' : 'Nordics', active: true },
            { name: lang === 'da' ? 'EU' : 'EU', active: false },
          ].map((z, i) => (
            <div key={i} className="flex between items-center" style={{
              padding: '14px', background: 'var(--input-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-inner)'
            }}>
              <span className="bold">{z.name}</span>
              <Toggle on={z.active} onChange={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.PageShipping = PageShipping;
