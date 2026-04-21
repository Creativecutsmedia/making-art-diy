function PageNewsletter({ t, lang }) {
  const I = window.Icons;
  const { NEWSLETTERS } = window.MAD_DATA;
  const [composing, setComposing] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [content, setContent] = React.useState('');
  const [recipientType, setRecipientType] = React.useState('all');

  if (composing) {
    return (
      <div className="content" style={{ maxWidth: 1100 }}>
        <div className="page-header">
          <button className="btn btn-ghost" onClick={() => setComposing(false)} style={{ marginBottom: 8, paddingLeft: 0 }}>
            {t('back')}
          </button>
          <div className="flex between items-center">
            <div>
              <h1 className="page-title">{t('compose_newsletter')}</h1>
              <p className="page-sub">{t('gdpr_note')}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">{t('draft')}</button>
              <button className="btn btn-primary"><I.mail />{t('send')}</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          <div className="form-section" style={{ marginBottom: 0 }}>
            <div className="field mb-3">
              <label className="field-label">{t('subject_line')}</label>
              <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder={lang === 'da' ? 'Forårets nye printe er landet…' : 'Spring\'s new prints have arrived…'} />
            </div>
            <div className="field mb-3">
              <label className="field-label">{t('content')}</label>
              <textarea className="textarea" rows="14" value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={lang === 'da' ? 'Skriv din nyhedsmail her…' : 'Write your newsletter here…'} />
            </div>
            <div className="field">
              <label className="field-label">{t('recipients')}</label>
              <select className="select" value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                <option value="all">{t('recipients_all')}</option>
                <option value="adults">{t('recipients_adults')}</option>
                <option value="specific">{t('recipients_specific')}</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">{t('preview')}</h3>
              <span className="chip muted">{lang === 'da' ? 'Live' : 'Live'}</span>
            </div>
            <div style={{
              background: 'var(--input-bg)', borderRadius: 10, padding: 20,
              border: '1px solid var(--border)', minHeight: 400
            }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 18 }}>
                <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  <div className="sidebar-logo-mark" style={{ width: 28, height: 28, fontSize: 13 }}>M</div>
                  <span className="bold">Making Art DIY</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {subject || (lang === 'da' ? '(ingen emnelinje)' : '(no subject)')}
                </div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-mute)' }}>
                {content || (lang === 'da' ? '(dit indhold vises her…)' : '(your content shows here…)')}
              </div>
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  {lang === 'da' ? 'Se varerne' : 'Browse products'}
                </button>
              </div>
              <div className="small muted" style={{ marginTop: 28, textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                {lang === 'da' ? 'Afmeld nyhedsmail' : 'Unsubscribe'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-header flex between items-center">
        <div>
          <h1 className="page-title">{t('newsletter')}</h1>
          <p className="page-sub">{t('newsletters_sent')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setComposing(true)}>
          <I.plus />{t('new_newsletter').replace('+ ', '')}
        </button>
      </div>

      <div style={{
        padding: '10px 14px', background: 'var(--gold-softer)',
        border: '1px solid rgba(201, 150, 58, 0.22)', borderRadius: 10,
        marginBottom: 20, fontSize: 12.5, color: 'var(--fg-mute)',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <I.mail /> {t('gdpr_note')}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>{t('th_subject')}</th>
                <th>{t('th_sent')}</th>
                <th>{t('recipients')}</th>
                <th>{t('th_opened')}</th>
                <th>{t('th_clicked')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {NEWSLETTERS.map((n, i) => {
                const openRate = Math.round((n.opened / n.recipients) * 100);
                return (
                  <tr key={i}>
                    <td style={{ maxWidth: 360 }}>
                      <div className="bold" style={{ fontSize: 13 }}>
                        {lang === 'da' ? n.subject_da : n.subject_en}
                      </div>
                    </td>
                    <td className="mono small muted">{n.sent}</td>
                    <td className="bold">{n.recipients}</td>
                    <td>
                      <span className="bold">{n.opened}</span>
                      <span className="small muted"> · {openRate}%</span>
                    </td>
                    <td className="bold">{n.clicked}</td>
                    <td><Chip kind="ok">{lang === 'da' ? 'Sendt' : 'Sent'}</Chip></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.PageNewsletter = PageNewsletter;
