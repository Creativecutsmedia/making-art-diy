// Discounts
function PageDiscounts({ t, lang }) {
  const I = window.Icons;
  const { DISCOUNTS } = window.MAD_DATA;
  const [composing, setComposing] = React.useState(false);

  if (composing) {
    return (
      <div className="content" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <button className="btn btn-ghost" onClick={() => setComposing(false)} style={{ paddingLeft: 0, marginBottom: 8 }}>{t('back')}</button>
          <div className="flex between items-center">
            <div>
              <h1 className="page-title">{t('discount_form')}</h1>
              <p className="page-sub">{lang === 'da' ? 'Udfyld detaljerne for den nye kampagne' : 'Fill in details for the new campaign'}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={() => setComposing(false)}>{t('cancel')}</button>
              <button className="btn btn-primary"><I.check />{t('save')}</button>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-grid-2" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">{t('th_code')}</label>
              <input className="input mono" placeholder="FORAAR15" />
            </div>
            <div className="field">
              <label className="field-label">{t('th_type')}</label>
              <select className="select"><option>{t('discount_percent')}</option><option>{t('discount_fixed')}</option></select>
            </div>
          </div>
          <div className="form-grid-2" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">{t('th_value')}</label>
              <input className="input" placeholder="15" />
            </div>
            <div className="field">
              <label className="field-label">{t('expires')}</label>
              <input className="input" type="date" />
            </div>
          </div>
          <div className="form-grid-2" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">{t('max_uses')}</label>
              <input className="input" placeholder="100" />
            </div>
            <div className="field">
              <label className="field-label">{t('applies_to')}</label>
              <select className="select">
                <option>{t('all_products')}</option>
                <option>{t('specific_categories')}</option>
                <option>{t('specific_products')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusChip = (s) => ({
    active: <Chip kind="ok">{t('discount_active')}</Chip>,
    expired: <Chip kind="muted">{t('discount_expired')}</Chip>,
    scheduled: <Chip kind="warn">{t('discount_scheduled')}</Chip>,
  }[s]);

  return (
    <div className="content">
      <div className="page-header flex between items-center">
        <div>
          <h1 className="page-title">{t('discounts')}</h1>
          <p className="page-sub">{t('discounts_sub')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setComposing(true)}><I.plus />{t('new_discount').replace('+ ', '')}</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>{t('th_code')}</th><th>{t('th_type')}</th><th>{t('th_value')}</th>
                <th>{t('th_used')}</th><th>{t('th_valid')}</th><th>{t('th_status')}</th>
              </tr>
            </thead>
            <tbody>
              {DISCOUNTS.map(d => (
                <tr key={d.code}>
                  <td className="mono bold">{d.code}</td>
                  <td>{d.type === 'percent' ? t('discount_percent') : t('discount_fixed')}</td>
                  <td className="bold">{d.type === 'percent' ? `${d.value}%` : `${d.value} ${t('kr')}`}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="bold">{d.used}</span>
                      <span className="small muted">/ {d.max}</span>
                      <div style={{ flex: 1, maxWidth: 80, height: 4, background: 'var(--chart-grid)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(d.used / d.max) * 100}%`, background: 'var(--gold)' }} />
                      </div>
                    </div>
                  </td>
                  <td className="mono small muted">{d.from} → {d.to}</td>
                  <td>{statusChip(d.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.PageDiscounts = PageDiscounts;
