// Order detail page + manual order modal + shipmondo card
const { useState: useStateOD } = React;

// Simple deterministic QR-looking SVG (not real QR, visual placeholder)
function FakeQR({ size = 180, seed = 'MAD' }) {
  const cells = 21;
  const cell = size / cells;
  // simple seeded PRNG
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) & 0xffff;
  const rand = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const rects = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      // finder patterns at corners
      const isFinder = (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
      if (isFinder) {
        const fx = x < 7 ? x : x - (cells - 7);
        const fy = y < 7 ? y : y - (cells - 7);
        const on = (fx === 0 || fx === 6 || fy === 0 || fy === 6) || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        if (on) rects.push(<rect key={`${x}-${y}`} x={x*cell} y={y*cell} width={cell} height={cell} fill="#000" />);
        continue;
      }
      if (rand() > 0.52) rects.push(<rect key={`${x}-${y}`} x={x*cell} y={y*cell} width={cell} height={cell} fill="#000" />);
    }
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff' }}>{rects}</svg>;
}

function OrderDetailFull({ order, onBack, t, lang, navigate }) {
  const I = window.Icons;
  const { CUSTOMERS } = window.MAD_DATA;
  const [notes, setNotes] = useStateOD(order.notes || []);
  const [noteText, setNoteText] = useStateOD('');
  const [fragtCreated, setFragtCreated] = useStateOD(order.fragt_status !== 'none');
  const [actionsOpen, setActionsOpen] = useStateOD(false);

  const customer = CUSTOMERS.find(c => c.email === order.email) || {};
  const steps = order.payment === 'cc' || order.status !== 'cancelled'
    ? ['created','paid','production','ready','shipped','delivered']
    : ['created','paid','cancelled'];
  const doneTimes = Object.fromEntries(order.timeline.map(e => [e.status, e.ts]));

  const addNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const ts = now.toISOString().slice(0,16).replace('T',' ');
    setNotes([...notes, { ts, text_da: noteText, text_en: noteText }]);
    setNoteText('');
  };

  return (
    <div className="content">
      <button className="btn btn-ghost" onClick={onBack} style={{ paddingLeft: 0, marginBottom: 8 }}>
        ← {t('back_to_orders')}
      </button>

      <div className="flex between items-center" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            {order.no}
            {order.manual && <span className="manual-badge" title={t('manual_badge')}>M</span>}
            <StatusChipFull status={order.status} t={t} />
          </h1>
          <p className="page-sub">{order.date}</p>
        </div>
        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          <button className="btn btn-secondary" onClick={() => setActionsOpen(o => !o)}>
            {t('od_actions')} <I.chevron_down />
          </button>
          {actionsOpen && (
            <div className="dropdown">
              <div className="dropdown-item"><I.activity />{t('od_change_status')}</div>
              <div className="dropdown-item"><I.send />{t('od_send_email')}</div>
              <div className="dropdown-item"><I.printer />{t('od_print_slip')}</div>
              <div className="dropdown-item"><I.x />{t('od_cancel')}</div>
              {order.payment === 'cc' && <div className="dropdown-item"><I.refund />{t('od_refund')}</div>}
            </div>
          )}
        </div>
      </div>

      <div className="od-grid">
        {/* LEFT */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head"><h3 className="card-title">{t('od_items')}</h3></div>
            <table className="data">
              <thead><tr><th></th><th>{lang==='da'?'Produkt':'Product'}</th><th>{t('mo_qty')}</th><th>{t('mo_unit_price')}</th><th>{t('mo_line_total')}</th></tr></thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i}>
                    <td><Thumb kind={it.thumb} /></td>
                    <td>
                      <div className="bold">{lang === 'da' ? it.name_da : it.name_en}</div>
                      <div className="small muted mono">{it.sku}</div>
                    </td>
                    <td>{it.qty}</td>
                    <td>{it.price} {t('kr')}</td>
                    <td className="bold">{it.qty * it.price} {t('kr')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--input-bg)', borderRadius: '0 0 var(--radius-card) var(--radius-card)' }}>
              <div className="flex between"><span className="muted small">{t('mo_subtotal')}</span><span>{order.subtotal} {t('kr')}</span></div>
              <div className="flex between"><span className="muted small">{t('fragt_status')}</span><span>{order.shipping} {t('kr')}</span></div>
              <div className="flex between" style={{ marginTop: 6, borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                <span className="bold">{t('total')}</span>
                <span className="bold" style={{ fontSize: 16 }}>{order.amount} {t('kr')}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">{t('od_notes')}</h3>
              <span className="small muted">{notes.length}</span>
            </div>
            {notes.length === 0 && <div className="small muted" style={{ padding: 10 }}>{lang==='da'?'Ingen noter endnu':'No notes yet'}</div>}
            {notes.map((n, i) => (
              <div key={i} style={{ padding: '10px 12px', borderBottom: i < notes.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="small muted mono">{n.ts}</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{lang === 'da' ? n.text_da : n.text_en}</div>
              </div>
            ))}
            <div style={{ padding: 12, display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
              <input className="input" placeholder={t('od_add_note')} value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()} />
              <button className="btn btn-primary" onClick={addNote}><I.plus /></button>
            </div>
          </div>
        </div>

        {/* MIDDLE — timeline */}
        <div className="card">
          <div className="card-head"><h3 className="card-title">{t('timeline')}</h3></div>
          <div className="vtimeline">
            {steps.map(s => {
              const done = !!doneTimes[s];
              const isCurrent = s === order.status;
              const cls = s === 'cancelled' && done ? 'cancelled' : isCurrent ? 'current' : done ? 'done' : '';
              return (
                <div key={s} className={`vtimeline-item ${cls}`}>
                  <div className="vtimeline-title">{t('status_' + s)}</div>
                  <div className="vtimeline-time">{doneTimes[s] || '—'}</div>
                </div>
              );
            })}
          </div>
          {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded' && (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
              <I.arrow_up style={{ transform: 'rotate(90deg)' }} />{t('od_next_status')}
            </button>
          )}
          {order.payment === 'cc' && (
            <div className="small muted" style={{ marginTop: 10, textAlign: 'center' }}>
              <a href="#" style={{ color: 'var(--gold)' }}>{t('od_regen')}</a>
            </div>
          )}
        </div>

        {/* RIGHT — kunde/adresse/betaling/fragt */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head"><h3 className="card-title">{t('od_customer')}</h3></div>
            <div className="bold" style={{ fontSize: 14 }}>{order.customer}</div>
            <div className="small muted">{order.email || '—'}</div>
            <div className="small muted">{customer.phone || ''}</div>
            <div style={{ marginTop: 8, fontSize: 12 }}>
              <span className="muted">{t('od_previous_orders')}: </span>
              <span className="bold">{customer.orders || 1}</span>
            </div>
            <button className="btn btn-ghost small-btn" style={{ marginTop: 8, paddingLeft: 0 }}
              onClick={() => navigate && navigate('customers')}>
              {t('od_view_customer')} →
            </button>
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head"><h3 className="card-title">{t('od_delivery')}</h3></div>
            <div className="small">{customer.address || '—'}</div>
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head"><h3 className="card-title">{t('od_payment')}</h3></div>
            <div className="kv-row"><span className="kv-k">{t('od_method')}</span><span className="kv-v"><PayChip method={order.payment} t={t} /></span></div>
            <div className="kv-row"><span className="kv-k">{t('od_amount')}</span><span className="kv-v bold">{order.amount} {t('kr')}</span></div>
            {order.stripe_id && (
              <>
                <div className="kv-row"><span className="kv-k">Stripe ID</span><span className="kv-v mono small">{order.stripe_id.slice(0,12)}…</span></div>
                <a href="#" className="small" style={{ color: 'var(--gold)', display: 'block', marginTop: 8 }}>
                  {t('od_stripe_link')} →
                </a>
              </>
            )}
            {order.payment !== 'cc' && (
              <div className="gold-box" style={{ marginTop: 10 }}>
                <I.info />
                <span>{lang==='da'?'Manuel betaling — tæller ikke i omsætning':'Manual payment — not counted in revenue'}</span>
              </div>
            )}
          </div>

          <ShipmondoCard order={order} t={t} lang={lang} fragtCreated={fragtCreated} setFragtCreated={setFragtCreated} />
        </div>
      </div>
    </div>
  );
}

function ShipmondoCard({ order, t, lang, fragtCreated, setFragtCreated }) {
  const I = window.Icons;
  if (order.fragt_method === 'Afhentning i værkstedet' || order.fragt_method === 'Selvleveret') {
    return (
      <div className="card">
        <div className="card-head"><h3 className="card-title">{t('od_fragt')}</h3></div>
        <div className="kv-row"><span className="kv-k">{t('od_method')}</span><span className="kv-v">{order.fragt_method}</span></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">{t('od_fragt')}</h3>
        <span className="chip blue">Shipmondo</span>
      </div>

      {!fragtCreated ? (
        <>
          <div className="field" style={{ marginBottom: 10 }}>
            <label className="field-label">{t('shm_package_size')}</label>
            <select className="input">
              <option>{t('pkg_s')}</option>
              <option>{t('pkg_m')}</option>
              <option>{t('pkg_l')}</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">{t('shm_dropoff')}</label>
            <select className="input">
              <option>{t('shm_parcelshop')}</option>
              <option>{t('shm_pickup')}</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setFragtCreated(true)}>
            <I.qr />{t('shm_create')}
          </button>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div className="qr-frame"><FakeQR seed={order.no} size={160} /></div>
            <div className="small muted" style={{ marginTop: 8, fontStyle: 'italic' }}>
              {t('shm_scan_hint')}
            </div>
          </div>
          <div className="kv-row"><span className="kv-k">{t('shm_tracking')}</span>
            <span className="kv-v mono">{order.tracking || 'GLS-78420193-DK'}</span></div>
          <div className="kv-row"><span className="kv-k">{t('od_method')}</span><span className="kv-v small">{order.fragt_method}</span></div>
          <div className="flex gap-2" style={{ marginTop: 12 }}>
            <button className="btn btn-secondary small-btn" style={{ flex: 1 }}><I.send />{t('shm_send_qr')}</button>
            <button className="btn btn-secondary small-btn" style={{ flex: 1 }}><I.download />PDF</button>
          </div>
          <a href="#" className="small" style={{ color: 'var(--gold)', display: 'block', marginTop: 10, textAlign: 'center' }}>
            {t('shm_track')} →
          </a>
        </>
      )}
    </div>
  );
}

window.OrderDetailFull = OrderDetailFull;
window.FakeQR = FakeQR;
