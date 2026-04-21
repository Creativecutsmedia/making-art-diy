function PageSettings({ t, lang }) {
  const I = window.Icons;
  const [notifOrder, setNotifOrder] = React.useState(true);
  const [notifCustomer, setNotifCustomer] = React.useState(true);
  const [notifStock, setNotifStock] = React.useState(false);

  return (
    <div className="content" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">{t('settings')}</h1>
        <p className="page-sub">{lang === 'da' ? 'Administrer din butik' : 'Manage your store'}</p>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('settings_store')}</h3>
        <p className="form-section-desc">{t('settings_store_desc')}</p>
        <div className="form-grid-2" style={{ marginBottom: 14 }}>
          <div className="field">
            <label className="field-label">{lang === 'da' ? 'Butiksnavn' : 'Store name'}</label>
            <input className="input" defaultValue="Making Art DIY" />
          </div>
          <div className="field">
            <label className="field-label">{lang === 'da' ? 'Kontakt-email' : 'Contact email'}</label>
            <input className="input" defaultValue="info@makingartdiy.dk" />
          </div>
        </div>
        <div className="form-grid-3">
          <div className="field">
            <label className="field-label">{t('th_phone')}</label>
            <input className="input" defaultValue="+45 28 14 92 03" />
          </div>
          <div className="field">
            <label className="field-label">CVR</label>
            <input className="input mono" defaultValue="42 18 92 03" />
          </div>
          <div className="field">
            <label className="field-label">{lang === 'da' ? 'Valuta' : 'Currency'}</label>
            <select className="select"><option>DKK (kr)</option><option>EUR (€)</option></select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('settings_payment')}</h3>
        <p className="form-section-desc">{lang === 'da' ? 'Hvordan dine kunder betaler' : 'How your customers pay'}</p>
        {['Dankort / Visa', 'Apple Pay', 'Google Pay', 'Klarna'].map((m) => (
          <div key={m} className="flex between items-center" style={{
            padding: '12px 14px', background: 'var(--input-bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-inner)', marginBottom: 8
          }}>
            <span className="bold">{m}</span>
            <Toggle on={true} onChange={() => {}} />
          </div>
        ))}
        <p className="small muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          {lang === 'da'
            ? 'Manuelle betalingsmetoder (MobilePay, bankoverførsel, kontant, bytte, gratis) administreres pr. ordre i Ordrestyring → Opret manuel ordre.'
            : 'Manual payment methods (MobilePay, bank transfer, cash, barter, free) are managed per-order in Order management → Create manual order.'}
        </p>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('settings_tax')}</h3>
        <p className="form-section-desc">{lang === 'da' ? 'Moms opkræves automatisk på alle ordrer' : 'VAT is charged automatically on all orders'}</p>
        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">{lang === 'da' ? 'Moms-sats' : 'VAT rate'}</label>
            <input className="input" defaultValue="25%" />
          </div>
          <div className="field">
            <label className="field-label">{lang === 'da' ? 'Priser vises' : 'Prices shown'}</label>
            <select className="select">
              <option>{lang === 'da' ? 'Inkl. moms' : 'Incl. VAT'}</option>
              <option>{lang === 'da' ? 'Ekskl. moms' : 'Excl. VAT'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('settings_notifications')}</h3>
        <p className="form-section-desc">{lang === 'da' ? 'Hvornår vi sender dig en besked' : 'When we notify you'}</p>
        {[
          { label: lang === 'da' ? 'Ny ordre' : 'New order', state: notifOrder, set: setNotifOrder },
          { label: lang === 'da' ? 'Ny kunde' : 'New customer', state: notifCustomer, set: setNotifCustomer },
          { label: lang === 'da' ? 'Lavt lager' : 'Low stock', state: notifStock, set: setNotifStock },
        ].map((n, i) => (
          <div key={i} className="flex between items-center" style={{
            padding: '12px 14px', background: 'var(--input-bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-inner)', marginBottom: 8
          }}>
            <span className="bold">{n.label}</span>
            <Toggle on={n.state} onChange={n.set} />
          </div>
        ))}
      </div>

      <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary">{t('cancel')}</button>
        <button className="btn btn-primary"><I.check />{t('save')}</button>
      </div>
    </div>
  );
}

window.PageSettings = PageSettings;
