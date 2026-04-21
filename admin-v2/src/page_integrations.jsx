// Integrations
function PageIntegrations({ t, lang }) {
  const I = window.Icons;
  const { INTEGRATIONS } = window.MAD_DATA;

  const dot = (s) => {
    const cls = s === 'connected' ? 'ok' : s === 'degraded' ? 'warn' : 'muted';
    const label = s === 'connected' ? t('connected') : s === 'degraded' ? t('degraded') : t('disconnected');
    return <Chip kind={cls}>{label}</Chip>;
  };

  return (
    <div className="content">
      <div className="page-header">
        <h1 className="page-title">{t('integrations')}</h1>
        <p className="page-sub">{t('integrations_sub')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {INTEGRATIONS.map(int => (
          <div key={int.id} className="integration-card">
            <div className="flex items-center gap-3">
              <div className="integration-logo">{int.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bold" style={{ fontSize: 15 }}>{int.name}</div>
                <div className="small muted">{lang === 'da' ? int.desc_da : int.desc_en}</div>
              </div>
              {dot(int.status)}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              {int.lines.map((l, i) => (
                <div key={i} className="kv-row" style={{ padding: '6px 0', borderBottom: 'none', fontSize: 12.5 }}>
                  <span className="kv-k">{lang === 'da' ? l.k_da : l.k_en}</span>
                  <span className="kv-v">{l.v}</span>
                </div>
              ))}
            </div>
            <button className={`btn ${int.status === 'disconnected' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'center' }}>
              {int.status === 'disconnected' ? t('connect') : t('manage')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

window.PageIntegrations = PageIntegrations;
