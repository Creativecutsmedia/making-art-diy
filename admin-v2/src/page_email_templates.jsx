// Email templates
function PageEmailTemplates({ t, lang }) {
  const I = window.Icons;
  const { EMAIL_TEMPLATES } = window.MAD_DATA;
  const [selected, setSelected] = React.useState(null);
  const [useBrand, setUseBrand] = React.useState(true);
  const [includeLogo, setIncludeLogo] = React.useState(true);

  if (selected) {
    return (
      <div className="content" style={{ maxWidth: 1200 }}>
        <div className="page-header">
          <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ paddingLeft: 0, marginBottom: 8 }}>{t('back')}</button>
          <div className="flex between items-center">
            <div>
              <h1 className="page-title">{t('tmpl_' + selected.id)}</h1>
              <p className="page-sub">{t('sends_on')}: {lang === 'da' ? selected.trigger_da : selected.trigger_en}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">{t('preview')}</button>
              <button className="btn btn-primary"><I.check />{t('save')}</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          <div>
            <div className="form-section">
              <h3 className="form-section-title">{t('basics')}</h3>
              <div className="form-grid-2" style={{ marginBottom: 14 }}>
                <div className="field"><label className="field-label">{t('subject_da')}</label><input className="input" defaultValue={selected.subject_da} /></div>
                <div className="field"><label className="field-label">{t('subject_en')}</label><input className="input" defaultValue={selected.subject_en} /></div>
              </div>
              <div className="form-grid-2">
                <div className="field"><label className="field-label">{t('body_da')}</label>
                  <textarea className="textarea" rows="9" defaultValue={lang === 'da' ? 'Hej {{navn}}, tak for din ordre hos Making Art DIY…' : ''} /></div>
                <div className="field"><label className="field-label">{t('body_en')}</label>
                  <textarea className="textarea" rows="9" defaultValue="Hi {{name}}, thanks for your order at Making Art DIY…" /></div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">{lang === 'da' ? 'Visuelt udtryk' : 'Visual style'}</h3>
              <div className="flex between items-center" style={{ padding: '12px 14px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-inner)', marginBottom: 8 }}>
                <span className="bold">{t('use_brand_colors')}</span><Toggle on={useBrand} onChange={setUseBrand} />
              </div>
              <div className="flex between items-center" style={{ padding: '12px 14px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-inner)' }}>
                <span className="bold">{t('include_logo')}</span><Toggle on={includeLogo} onChange={setIncludeLogo} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3 className="card-title">{t('preview')}</h3><Chip kind="ok">Live</Chip></div>
            <div style={{ background: useBrand ? '#F7F5EF' : 'var(--input-bg)', color: '#1C1814', borderRadius: 10, padding: 24, border: '1px solid var(--border)', minHeight: 400 }}>
              {includeLogo && (
                <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                  <div className="sidebar-logo-mark" style={{ width: 32, height: 32, fontSize: 14 }}>M</div>
                  <span className="bold" style={{ color: '#1C1814' }}>Making Art DIY</span>
                </div>
              )}
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#1C1814', marginBottom: 14 }}>
                {lang === 'da' ? selected.subject_da : selected.subject_en}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: '#3a2e20' }}>
                {selected.id === 'fragt_qr' ? (
                  <>
                    {lang === 'da' ? 'Hej {{navn}},' : 'Hi {{name}},'}<br /><br />
                    {lang === 'da' ? 'Din ordre hos Making Art DIY er nu sendt afsted.' : 'Your order from Making Art DIY has been shipped.'}<br /><br />
                    {lang === 'da' ? 'Du kan følge pakken her: {{track_link}}' : 'Track your parcel here: {{track_link}}'}<br /><br />
                    {lang === 'da' ? 'Scan også QR-koden herunder i fx PostNords app for hurtig opslag.' : 'You can also scan the QR code below in an app like PostNord\'s for quick tracking lookup.'}<br /><br />
                    {lang === 'da' ? 'Forventet levering: {{forventet_levering}}' : 'Expected delivery: {{expected_delivery}}'}<br /><br />
                    {lang === 'da' ? 'Med venlig hilsen,' : 'Best regards,'}<br />Making Art DIY
                  </>
                ) : (
                  <>
                    {lang === 'da' ? 'Hej {{navn}},' : 'Hi {{name}},'}<br /><br />
                    {lang === 'da' ? 'Tak for din ordre hos Making Art DIY. Vi går straks i gang med at producere dine varer.' : 'Thanks for your order at Making Art DIY. We\'ll start producing your items right away.'}<br /><br />
                    {lang === 'da' ? 'Med venlig hilsen,' : 'Kind regards,'}<br />Malik
                  </>
                )}
              </div>
              {selected.id === 'fragt_qr' && window.FakeQR && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <div className="qr-frame">
                    <window.FakeQR seed="fragt-preview" size={140} />
                  </div>
                </div>
              )}
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button className="btn btn-primary" style={{ background: useBrand ? '#C9963A' : '#666', pointerEvents: 'none' }}>
                  {selected.id === 'fragt_qr'
                    ? (lang === 'da' ? 'Følg pakken' : 'Track your parcel')
                    : (lang === 'da' ? 'Se din ordre' : 'View your order')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('email_templates')}</h1>
        <p className="page-sub">{t('templates_sub')}</p>
      </div>

      <div className="info-box" style={{ marginBottom: 18 }}>
        <I.info /><span>{t('tmpl_cc_banner')}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {EMAIL_TEMPLATES.map(tmpl => (
          <div key={tmpl.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(tmpl)}>
            <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <div className="integration-logo"><I.inbox /></div>
              <div style={{ flex: 1 }}>
                <div className="bold" style={{ fontSize: 14 }}>{t('tmpl_' + tmpl.id)}</div>
                <div className="small muted">{lang === 'da' ? tmpl.trigger_da : tmpl.trigger_en}</div>
              </div>
            </div>
            <div className="small muted" style={{ padding: '10px 12px', background: 'var(--input-bg)', borderRadius: 8, fontFamily: 'inherit' }}>
              <span className="muted small">{t('subject_line')}:</span><br />
              <span className="bold" style={{ color: 'var(--fg)' }}>{lang === 'da' ? tmpl.subject_da : tmpl.subject_en}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.PageEmailTemplates = PageEmailTemplates;
