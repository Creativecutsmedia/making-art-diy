// Re-usable bits: ProgressRing, DKMap, ActivityFeed, Callout, EmptyState, Skeleton, Accordion
function ProgressRing({ value, max, size = 160, thickness = 14, label, sub }) {
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = `${circ * pct} ${circ * (1 - pct) + 1}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--chart-grid)" strokeWidth={thickness}/>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#C9963A" strokeWidth={thickness}
        strokeDasharray={dash} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`} />
      <text x={c} y={c - 4} textAnchor="middle" fill="var(--fg)" fontSize="24" fontWeight="600" letterSpacing="-0.02em">{label}</text>
      <text x={c} y={c + 18} textAnchor="middle" fill="var(--fg-soft)" fontSize="11">{sub}</text>
    </svg>
  );
}

function DKMap({ cities }) {
  // Extremely stylized Denmark blob — three main regions (Jutland, Funen, Zealand)
  return (
    <div className="dk-map-wrap">
      <svg className="dk-svg" viewBox="0 0 100 82" preserveAspectRatio="xMidYMid meet">
        {/* Jutland */}
        <path className="dk-land" d="M28,10 Q26,4 34,4 Q44,3 48,10 Q52,14 50,22 Q54,28 52,36 Q54,44 50,52 Q54,60 48,68 Q44,74 38,72 Q32,74 30,68 Q26,64 30,58 Q26,52 30,46 Q26,40 30,34 Q26,28 30,22 Q26,16 28,10 Z"/>
        {/* Funen */}
        <ellipse className="dk-land" cx="62" cy="60" rx="8" ry="7"/>
        {/* Zealand */}
        <path className="dk-land" d="M74,44 Q80,40 86,46 Q90,52 88,60 Q84,66 78,66 Q72,62 72,54 Q70,48 74,44 Z"/>
        {/* Bornholm */}
        <circle className="dk-land" cx="95" cy="68" r="2.5"/>

        {cities.map((c, i) => {
          const r = 1.2 + Math.sqrt(c.orders) * 0.7;
          return <circle key={i} className="dk-dot" cx={c.x} cy={c.y} r={r}>
            <title>{c.name}: {c.orders}</title>
          </circle>;
        })}
      </svg>
    </div>
  );
}

function ActivityFeed({ items, lang, limit }) {
  const I = window.Icons;
  const iconFor = (t) => {
    const m = { order: I.cart, product: I.box, newsletter: I.mail, discount: I.percent, settings: I.gear, login: I.user, customer: I.users };
    const Icon = m[t] || I.activity;
    return <Icon />;
  };
  const list = limit ? items.slice(0, limit) : items;
  return (
    <div>
      {list.map((a, i) => (
        <div key={i} className="activity-row">
          <div className="activity-icon">{iconFor(a.type)}</div>
          <div className="activity-text">
            <span className="activity-who">{a.who}</span>{' '}
            <span>{lang === 'da' ? a.text_da : a.text_en}</span>
          </div>
          <div className="activity-when">{lang === 'da' ? a.when_da : a.when_en}</div>
        </div>
      ))}
    </div>
  );
}

function Callout({ icon, title, children, onAction, actionLabel }) {
  return (
    <div className="callout">
      <div className="callout-icon">{icon}</div>
      <div style={{ flex: 1 }}>
        <div className="bold" style={{ fontSize: 13.5 }}>{title}</div>
        <div className="small muted" style={{ marginTop: 3 }}>{children}</div>
      </div>
      {onAction && <button className="btn btn-secondary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
      {action}
    </div>
  );
}

function Skeleton({ w, h = 14, style }) {
  return <div className="skel" style={{ width: w, height: h, ...style }} />;
}

function Accordion({ title, children, defaultOpen = false }) {
  const I = window.Icons;
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="form-section" style={{ paddingBottom: open ? 24 : 18 }}>
      <div className={`accordion-head ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <h3 className="form-section-title" style={{ margin: 0 }}>{title}</h3>
        <I.chevron_right />
      </div>
      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div style={{ paddingTop: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, onConfirm, confirmLabel, cancelLabel, danger }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 10px', fontSize: 17, letterSpacing: '-0.01em' }}>{title}</h3>
        <div className="muted small" style={{ marginBottom: 18, lineHeight: 1.5 }}>{children}</div>
        <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{cancelLabel}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}
            style={danger ? { background: 'var(--err)', color: 'white' } : {}}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressRing, DKMap, ActivityFeed, Callout, EmptyState, Skeleton, Accordion, Modal });
