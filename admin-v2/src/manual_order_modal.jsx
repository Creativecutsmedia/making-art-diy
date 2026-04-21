// Manual order modal — slide in from right
const { useState: useStateMO } = React;

function ManualOrderModal({ onClose, t, lang }) {
  const I = window.Icons;
  const { PRODUCTS, CUSTOMERS } = window.MAD_DATA;

  const [custMode, setCustMode] = useStateMO('existing'); // 'existing' | 'new'
  const [selectedCust, setSelectedCust] = useStateMO(null);
  const [custSearch, setCustSearch] = useStateMO('');
  const [saveCust, setSaveCust] = useStateMO(true);

  const [lines, setLines] = useStateMO([]);
  const [showPicker, setShowPicker] = useStateMO(false);
  const [prodSearch, setProdSearch] = useStateMO('');

  const [payment, setPayment] = useStateMO('mobilepay');
  const [stripeId, setStripeId] = useStateMO('');
  const [paidDate, setPaidDate] = useStateMO('2026-04-21');

  const [shipMode, setShipMode] = useStateMO('none');
  const [shipPrice, setShipPrice] = useStateMO(60);

  const [internalNote, setInternalNote] = useStateMO('');

  const matchCust = CUSTOMERS.filter(c =>
    !custSearch || `${c.name} ${c.email}`.toLowerCase().includes(custSearch.toLowerCase())
  ).slice(0, 5);

  const matchProd = PRODUCTS.filter(p =>
    !prodSearch || `${p.name_da} ${p.name_en} ${p.sku}`.toLowerCase().includes(prodSearch.toLowerCase())
  ).slice(0, 5);

  const addProduct = (p) => {
    setLines([...lines, { type: 'product', sku: p.sku, name_da: p.name_da, name_en: p.name_en, qty: 1, price: p.price, thumb: p.thumb }]);
    setShowPicker(false);
    setProdSearch('');
  };
  const addFreeLine = () => {
    setLines([...lines, { type: 'free', text_da: '', text_en: '', qty: 1, price: 0 }]);
  };
  const updateLine = (i, patch) => setLines(lines.map((l, j) => j === i ? { ...l, ...patch } : l));
  const removeLine = (i) => setLines(lines.filter((_, j) => j !== i));

  const subtotal = lines.reduce((s, l) => s + (l.qty * l.price), 0);
  const shipCost = shipMode === 'ship' ? Number(shipPrice) : 0;
  const total = subtotal + shipCost;

  return (
    <div className="slide-panel-overlay" onClick={onClose}>
      <div className="slide-panel" onClick={e => e.stopPropagation()}>
        <div className="slide-panel-head">
          <div>
            <h2 style={{ margin: 0, fontSize: 22, letterSpacing: '-0.02em' }}>{t('mo_title')}</h2>
            <p className="small muted" style={{ margin: '4px 0 0' }}>{t('mo_sub')}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><I.x /></button>
        </div>

        <div className="slide-panel-body">
          {/* Customer */}
          <div className="form-section">
            <h3 className="form-section-title">{t('mo_customer')}</h3>
            <div className="seg" style={{ marginBottom: 12 }}>
              <button className={custMode === 'existing' ? 'active' : ''} onClick={() => setCustMode('existing')}>
                {t('mo_find_customer')}
              </button>
              <button className={custMode === 'new' ? 'active' : ''} onClick={() => setCustMode('new')}>
                {t('mo_new_customer')}
              </button>
            </div>

            {custMode === 'existing' ? (
              <div>
                <input className="input" placeholder={t('mo_find_customer')}
                  value={selectedCust ? selectedCust.name : custSearch}
                  onChange={e => { setCustSearch(e.target.value); setSelectedCust(null); }} />
                {custSearch && !selectedCust && (
                  <div style={{ marginTop: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    {matchCust.map(c => (
                      <div key={c.email} className="dropdown-item" onClick={() => { setSelectedCust(c); setCustSearch(''); }}>
                        <div style={{ flex: 1 }}>
                          <div className="bold" style={{ fontSize: 13 }}>{c.name}</div>
                          <div className="small muted">{c.email} · {c.city}</div>
                        </div>
                        <span className="small muted">{c.orders} {lang === 'da' ? 'ordrer' : 'orders'}</span>
                      </div>
                    ))}
                    {matchCust.length === 0 && <div className="small muted" style={{ padding: 12 }}>{lang === 'da' ? 'Ingen match' : 'No matches'}</div>}
                  </div>
                )}
                {selectedCust && (
                  <div className="card" style={{ marginTop: 10, padding: 12 }}>
                    <div className="flex between">
                      <div>
                        <div className="bold">{selectedCust.name}</div>
                        <div className="small muted">{selectedCust.email}</div>
                        <div className="small muted">{selectedCust.address}</div>
                      </div>
                      <button className="icon-btn" onClick={() => setSelectedCust(null)}><I.x /></button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="form-grid-2">
                <div className="field"><label className="field-label">{t('th_name')}</label><input className="input" /></div>
                <div className="field"><label className="field-label">{t('th_email')} <span className="muted small">({lang === 'da' ? 'valgfri' : 'optional'})</span></label><input className="input" /></div>
                <div className="field"><label className="field-label">{t('th_phone')} <span className="muted small">({lang === 'da' ? 'valgfri' : 'optional'})</span></label><input className="input" /></div>
                <div className="field"><label className="field-label">{t('address')} <span className="muted small">({lang === 'da' ? 'hvis den skal sendes' : 'if shipping'})</span></label><input className="input" /></div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={saveCust} onChange={e => setSaveCust(e.target.checked)} />
                    <span>{t('mo_save_customer')}</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="form-section">
            <h3 className="form-section-title">{t('mo_products')}</h3>
            {lines.map((l, i) => (
              <div key={i} className="line-item">
                {l.type === 'product' ? <Thumb kind={l.thumb} /> : <I.tag />}
                <div>
                  {l.type === 'product' ? (
                    <>
                      <div className="bold" style={{ fontSize: 13 }}>{lang === 'da' ? l.name_da : l.name_en}</div>
                      <div className="small muted mono">{l.sku}</div>
                    </>
                  ) : (
                    <input className="input-tight" placeholder={lang === 'da' ? 'Fri tekst (fx Gave)' : 'Free text (e.g. Gift)'}
                      value={lang === 'da' ? l.text_da : l.text_en}
                      onChange={e => updateLine(i, lang === 'da' ? { text_da: e.target.value } : { text_en: e.target.value })} />
                  )}
                </div>
                <div className="qty-stepper">
                  <button onClick={() => updateLine(i, { qty: Math.max(1, l.qty - 1) })}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => updateLine(i, { qty: l.qty + 1 })}>+</button>
                </div>
                <input className="input-tight" type="number" value={l.price}
                  onChange={e => updateLine(i, { price: Number(e.target.value) || 0 })} />
                <div className="bold" style={{ textAlign: 'right' }}>{l.qty * l.price} {t('kr')}</div>
                <button className="icon-btn" onClick={() => removeLine(i)}><I.x /></button>
              </div>
            ))}

            {!showPicker ? (
              <div className="flex gap-2" style={{ marginTop: lines.length > 0 ? 6 : 0 }}>
                <button className="btn btn-secondary" onClick={() => setShowPicker(true)}><I.plus />{t('mo_add_product')}</button>
                <button className="btn btn-ghost" onClick={addFreeLine}>{t('mo_add_free_line')}</button>
              </div>
            ) : (
              <div className="card" style={{ padding: 10 }}>
                <input className="input" placeholder={t('mo_product_placeholder')}
                  value={prodSearch} onChange={e => setProdSearch(e.target.value)} autoFocus />
                <div style={{ marginTop: 8, maxHeight: 240, overflow: 'auto' }}>
                  {matchProd.map(p => (
                    <div key={p.sku} className="dropdown-item" onClick={() => addProduct(p)}>
                      <Thumb kind={p.thumb} />
                      <div style={{ flex: 1 }}>
                        <div className="bold" style={{ fontSize: 13 }}>{lang === 'da' ? p.name_da : p.name_en}</div>
                        <div className="small muted mono">{p.sku}</div>
                      </div>
                      <span className="bold">{p.price} {t('kr')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lines.length > 0 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--input-bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="flex between"><span className="muted">{t('mo_subtotal')}</span><span className="bold">{subtotal} {t('kr')}</span></div>
                {shipMode === 'ship' && <div className="flex between"><span className="muted">{t('fragt_status')}</span><span>{shipCost} {t('kr')}</span></div>}
                <div className="flex between" style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
                  <span className="bold">{t('total')}</span><span className="bold" style={{ fontSize: 16 }}>{total} {t('kr')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="form-section">
            <h3 className="form-section-title">{t('mo_payment')}</h3>
            <select className="input" value={payment} onChange={e => setPayment(e.target.value)} style={{ marginBottom: 12 }}>
              {['cc','mobilepay','bank','cash','barter','free'].map(p =>
                <option key={p} value={p}>{t('pay_' + p)}</option>)}
            </select>
            <div className="info-box" style={{ marginBottom: 12 }}>
              <I.info /><span>{t('mo_payment_hint')}</span>
            </div>
            {payment === 'cc' && (
              <div className="field"><label className="field-label">{t('mo_stripe_id')}</label>
                <input className="input mono" placeholder="ch_3NqK2vFj…" value={stripeId} onChange={e => setStripeId(e.target.value)} /></div>
            )}
            {payment === 'bank' && (
              <div className="field"><label className="field-label">{t('mo_paid_date')}</label>
                <input className="input" type="date" value={paidDate} onChange={e => setPaidDate(e.target.value)} /></div>
            )}
          </div>

          {/* Shipping */}
          <div className="form-section">
            <h3 className="form-section-title">{t('mo_shipping')}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { id: 'none', label: t('mo_ship_none') },
                { id: 'ship', label: t('mo_ship_ship') },
                { id: 'self', label: t('mo_ship_self') },
              ].map(o => (
                <label key={o.id} className="flex items-center gap-2" style={{ padding: '10px 12px', background: shipMode === o.id ? 'var(--gold-softer)' : 'var(--input-bg)', border: `1px solid ${shipMode === o.id ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" checked={shipMode === o.id} onChange={() => setShipMode(o.id)} />
                  <span className="bold">{o.label}</span>
                </label>
              ))}
            </div>
            {shipMode === 'ship' && (
              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field"><label className="field-label">{t('mo_ship_price')}</label>
                  <input className="input" type="number" value={shipPrice} onChange={e => setShipPrice(e.target.value)} /></div>
                <div className="field"><label className="field-label">{t('mo_package_size')}</label>
                  <select className="input">
                    <option>{t('pkg_s')}</option><option>{t('pkg_m')}</option><option>{t('pkg_l')}</option>
                  </select></div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label className="field-label">{t('mo_address')}</label>
                  <input className="input" defaultValue={selectedCust?.address || ''} />
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="form-section">
            <h3 className="form-section-title">{t('mo_internal_note')}</h3>
            <textarea className="textarea" rows="3" placeholder={t('mo_note_placeholder')}
              value={internalNote} onChange={e => setInternalNote(e.target.value)} />
          </div>
        </div>

        <div className="slide-panel-foot">
          <button className="btn btn-ghost" onClick={onClose}>{t('mo_save_draft')}</button>
          <button className="btn btn-primary" onClick={onClose}><I.check />{t('mo_create')}</button>
        </div>
      </div>
    </div>
  );
}

window.ManualOrderModal = ManualOrderModal;
