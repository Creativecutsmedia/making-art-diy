// Edit product form — calls 3.1a admin-products-write endpoint per
// docs/3.1b-product-edit-form-contract.md.
// State-machine: idle → dirty → saving → saved/error.
// 3.1b is edit-only; create new product is W5-scope.
function PageProductEdit({ t, lang, navigate, params }) {
  const I = window.Icons;
  const { data: products, loading: productsLoading } = useProducts();
  const isNew = params?.new;

  const existing = React.useMemo(() => {
    if (isNew || !params?.sku || !products) return null;
    return products.find(p => p.sku === params.sku) || null;
  }, [products, params?.sku, isNew]);

  const emptyForm = {
    sku: '', name_da: '', name_en: '', price: '', category: 'voksne',
    visible: true, desc_da: '', desc_en: '', notes: '',
    weight_grams: '', length_cm: '', width_cm: '', height_cm: '',
  };
  const [form, setForm] = React.useState(emptyForm);
  const [originalForm, setOriginalForm] = React.useState(emptyForm);
  const [slug, setSlug] = React.useState(null);

  const [saveState, setSaveState] = React.useState('idle');
  const [bannerMsg, setBannerMsg] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState({});

  // Hydrate form once products loaded + existing found
  React.useEffect(() => {
    if (existing) {
      const initial = {
        sku: existing.sku,
        name_da: existing.name_da || '',
        name_en: existing.name_en || '',
        price: String(existing.price ?? ''),
        category: existing.category || 'voksne',
        visible: existing.visible ?? true,
        desc_da: existing.desc_da || '',
        desc_en: existing.desc_en || '',
        notes: '',
        weight_grams: String(existing.weight_grams ?? ''),
        length_cm: String(existing.length_cm ?? ''),
        width_cm: String(existing.width_cm ?? ''),
        height_cm: String(existing.height_cm ?? ''),
      };
      setForm(initial);
      setOriginalForm(initial);
      setSlug(existing.slug);
    }
  }, [existing]);

  // Dirty-tracking via shallow JSON-equality.
  // Caveat: assumes primitive fields. 3.1c (extra_images array) needs deep-equality.
  const isDirty = React.useMemo(
    () => JSON.stringify(form) !== JSON.stringify(originalForm),
    [form, originalForm]
  );

  // Auto-fade success banner after 5s → idle
  React.useEffect(() => {
    if (saveState === 'saved') {
      const timer = setTimeout(() => {
        setSaveState('idle');
        setBannerMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (fieldErrors[k]) {
      setFieldErrors(prev => {
        const { [k]: _drop, ...rest } = prev;
        return rest;
      });
    }
  };

  const onCancel = () => {
    if (isDirty && !window.confirm(t('discard_changes_confirm'))) return;
    navigate('products');
  };

  const onSave = async () => {
    if (!slug) return;

    // Frontend min=0 guard. HTML5 min=0 håndhæves ikke uden form-submit;
    // backend validerer også per kontrakt §150 (belt-and-suspenders).
    const dimFields = ['weight_grams', 'length_cm', 'width_cm', 'height_cm'];
    if (dimFields.some(k => form[k] !== '' && parseInt(form[k], 10) < 0)) {
      setSaveState('error');
      setBannerMsg({ type: 'error', text: t('err_negative_dimension') });
      return;
    }

    setSaveState('saving');
    setBannerMsg(null);
    setFieldErrors({});
    try {
      const fields = formToFields(form);
      const res = await fetch('/.netlify/functions/admin-products-write', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, sku: form.sku, fields }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 200 && data.ok) {
        setSaveState('saved');
        setBannerMsg({ type: 'success', text: t('saved_message') });
        setOriginalForm(form);
        updateCachedProduct(form.sku, form);
        return;
      }
      const errorKey = data.error || 'internal_error';
      setSaveState('error');
      setBannerMsg({ type: 'error', text: t('err_' + errorKey) });
      if (errorKey === 'validation_failed' && data.details && data.details.fields) {
        const backendToForm = {
          title: 'name_da',
          title_en: 'name_en',
          description: 'desc_da',
          description_en: 'desc_en',
          price: 'price',
          category: 'category',
          published: 'visible',
          internal_notes: 'notes',
        };
        const mapped = {};
        for (const [bKey, msg] of Object.entries(data.details.fields)) {
          mapped[backendToForm[bKey] || bKey] = msg;
        }
        setFieldErrors(mapped);
      }
    } catch (err) {
      setSaveState('error');
      setBannerMsg({ type: 'error', text: t('err_network') });
    }
  };

  const dismissBanner = () => setBannerMsg(null);
  const saveDisabled = saveState === 'saving' || !isDirty || isNew;

  // Inline styles match admin-v2 pattern (page_products.jsx uses inline
  // var(--err)/var(--ok) for status indicators).
  const bannerStyle = (type) => ({
    marginBottom: 16,
    padding: '12px 14px',
    borderRadius: 'var(--radius-input)',
    border: '1px solid',
    borderColor: type === 'success' ? 'var(--ok)' : 'var(--err)',
    background: type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
    color: type === 'success' ? 'var(--ok)' : 'var(--err)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  });
  const fieldErrorStyle = { color: 'var(--err)', fontSize: 12, marginTop: 4 };

  // 3.1b is edit-only — create new product is W5
  if (isNew) {
    return (
      <div className="content" style={{ maxWidth: 960 }}>
        <button className="btn btn-ghost" onClick={() => navigate('products')} style={{ marginBottom: 8 }}>
          {t('back')}
        </button>
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-soft)' }}>
          {lang === 'da' ? 'Opret nyt produkt kommer i W5.' : 'Create new product coming in W5.'}
        </div>
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="content" style={{ maxWidth: 960 }}>
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-soft)' }}>
          {lang === 'da' ? 'Indlæser produkt…' : 'Loading product…'}
        </div>
      </div>
    );
  }

  if (!existing) {
    return (
      <div className="content" style={{ maxWidth: 960 }}>
        <div style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ color: 'var(--err)', marginBottom: 12 }}>{t('err_product_not_found')}</div>
          <button className="btn btn-secondary" onClick={() => navigate('products')}>
            {t('back_to_products')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content" style={{ maxWidth: 960 }}>
      <div className="page-header">
        <button className="btn btn-ghost" onClick={onCancel} style={{ marginBottom: 8, paddingLeft: 0 }}>
          {t('back')}
        </button>
        <div className="flex between items-center">
          <div>
            <h1 className="page-title">{t('edit_product')}</h1>
            <p className="page-sub">{existing.sku}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={onCancel} disabled={saveState === 'saving'}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={onSave} disabled={saveDisabled}>
              {saveState === 'saving' ? t('saving') : <><I.check />{t('save')}</>}
            </button>
          </div>
        </div>
      </div>

      {bannerMsg && (
        <div style={bannerStyle(bannerMsg.type)}>
          <span>{bannerMsg.text}</span>
          {bannerMsg.type === 'error' && (
            <button
              className="btn btn-ghost"
              onClick={dismissBanner}
              title={t('dismiss')}
              style={{ padding: '0 8px', minWidth: 'auto' }}
            >×</button>
          )}
        </div>
      )}

      {/* Basics */}
      <div className="form-section">
        <h3 className="form-section-title">{t('basics')}</h3>
        <p className="form-section-desc">{t('basics_desc')}</p>

        <div className="form-grid-3" style={{ marginBottom: 14 }}>
          <div className="field">
            <label className="field-label">{t('th_sku')}</label>
            <input className="input mono" value={form.sku} readOnly />
          </div>
          <div className="field">
            <label className="field-label">{t('price_dkk')}</label>
            <input className="input" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
            {fieldErrors.price && <div style={fieldErrorStyle}>{fieldErrors.price}</div>}
          </div>
          <div className="field">
            <label className="field-label">{t('th_category')}</label>
            <select className="select" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="voksne">{t('cat_voksne')}</option>
              <option value="born">{t('cat_born')}</option>
              <option value="erhverv">{t('cat_erhverv')}</option>
            </select>
            {fieldErrors.category && <div style={fieldErrorStyle}>{fieldErrors.category}</div>}
          </div>
        </div>

        <div className="form-grid-2" style={{ marginBottom: 14 }}>
          <div className="field">
            <label className="field-label">{t('name_da')}</label>
            <input className="input" value={form.name_da} onChange={(e) => update('name_da', e.target.value)} />
            {fieldErrors.name_da && <div style={fieldErrorStyle}>{fieldErrors.name_da}</div>}
          </div>
          <div className="field">
            <label className="field-label">{t('name_en')}</label>
            <input className="input" value={form.name_en} onChange={(e) => update('name_en', e.target.value)} />
            {fieldErrors.name_en && <div style={fieldErrorStyle}>{fieldErrors.name_en}</div>}
          </div>
        </div>

        <div className="flex items-center between" style={{
          padding: '12px 14px', background: 'var(--input-bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-input)'
        }}>
          <div>
            <div className="bold" style={{ fontSize: 13.5 }}>{t('visible_field')}</div>
            <div className="small muted">{form.visible ? t('visible_yes') : t('visible_no')}</div>
          </div>
          <Toggle on={form.visible} onChange={(v) => update('visible', v)} />
        </div>
      </div>

      {/* Description */}
      <div className="form-section">
        <h3 className="form-section-title">{t('description')}</h3>
        <p className="form-section-desc">{t('description_desc')}</p>
        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">{t('desc_da')}</label>
            <textarea className="textarea" rows="5" value={form.desc_da} onChange={(e) => update('desc_da', e.target.value)} />
            {fieldErrors.desc_da && <div style={fieldErrorStyle}>{fieldErrors.desc_da}</div>}
          </div>
          <div className="field">
            <label className="field-label">{t('desc_en')}</label>
            <textarea className="textarea" rows="5" value={form.desc_en} onChange={(e) => update('desc_en', e.target.value)} />
            {fieldErrors.desc_en && <div style={fieldErrorStyle}>{fieldErrors.desc_en}</div>}
          </div>
        </div>
      </div>

      {/* Leveringsdetaljer (3.1c) */}
      <div className="form-section">
        <h3 className="form-section-title">{t('delivery_details')}</h3>
        <p className="form-section-desc">{t('delivery_details_desc')}</p>
        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">{t('weight_grams')}</label>
            <input className="input" type="number" min="0" step="1"
              value={form.weight_grams}
              onChange={(e) => update('weight_grams', e.target.value)} />
          </div>
          <div className="form-grid-3">
            <div className="field">
              <label className="field-label">{t('dim_length_cm')}</label>
              <input className="input" type="number" min="0" step="1"
                value={form.length_cm}
                onChange={(e) => update('length_cm', e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">{t('dim_width_cm')}</label>
              <input className="input" type="number" min="0" step="1"
                value={form.width_cm}
                onChange={(e) => update('width_cm', e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">{t('dim_height_cm')}</label>
              <input className="input" type="number" min="0" step="1"
                value={form.height_cm}
                onChange={(e) => update('height_cm', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="form-section">
        <h3 className="form-section-title">{t('internal_notes')}</h3>
        <p className="form-section-desc">{t('internal_notes_desc')}</p>
        <textarea className="textarea" rows="5" placeholder={t('notes_placeholder')}
          value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        {fieldErrors.notes && <div style={fieldErrorStyle}>{fieldErrors.notes}</div>}
      </div>

      <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onCancel} disabled={saveState === 'saving'}>
          {t('cancel')}
        </button>
        <button className="btn btn-primary" onClick={onSave} disabled={saveDisabled}>
          {saveState === 'saving' ? t('saving') : <><I.check />{t('save')}</>}
        </button>
      </div>
    </div>
  );
}

window.PageProductEdit = PageProductEdit;
