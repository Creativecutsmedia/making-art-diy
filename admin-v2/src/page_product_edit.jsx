// Add / Edit product form
function PageProductEdit({ t, lang, navigate, params }) {
  const I = window.Icons;
  const { PRODUCTS, INTERNAL_FILES } = window.MAD_DATA;
  const existing = params?.sku ? PRODUCTS.find(p => p.sku === params.sku) : null;
  const isNew = params?.new;

  const [form, setForm] = React.useState({
    sku: existing?.sku || '',
    name_da: existing?.name_da || '',
    name_en: existing?.name_en || '',
    price: existing?.price || '',
    category: existing?.category || 'voksne',
    visible: existing?.visible ?? true,
    desc_da: existing?.desc_da || '',
    desc_en: existing?.desc_en || '',
    notes: existing ? '8 skruer 4x40mm, træ fra Silvan, printtid 4t @ 0.2mm. Husk at slibe kanter før lakering.' : '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const thumbKind = existing?.thumb || 'gold';

  const galleryImages = [
    { kind: thumbKind, primary: true },
    { kind: 'wood' },
    { kind: 'blue' },
    { kind: 'purple' },
  ];

  return (
    <div className="content" style={{ maxWidth: 960 }}>
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('products')} style={{ marginBottom: 8, paddingLeft: 0 }}>
          {t('back')}
        </button>
        <div className="flex between items-center">
          <div>
            <h1 className="page-title">{isNew ? t('add_product_title') : t('edit_product')}</h1>
            <p className="page-sub">{existing ? existing.sku : t('add_product_title')}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary">{t('cancel')}</button>
            <button className="btn btn-primary">{t('save')}</button>
          </div>
        </div>
      </div>

      {/* Basics */}
      <div className="form-section">
        <h3 className="form-section-title">{t('basics')}</h3>
        <p className="form-section-desc">{t('basics_desc')}</p>

        <div className="form-grid-3" style={{ marginBottom: 14 }}>
          <div className="field">
            <label className="field-label">{t('th_sku')}</label>
            <input className="input mono" value={form.sku} onChange={(e) => update('sku', e.target.value)} placeholder="MAD-XXXX-001" />
          </div>
          <div className="field">
            <label className="field-label">{t('price_dkk')}</label>
            <input className="input" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">{t('th_category')}</label>
            <select className="select" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="voksne">{t('cat_voksne')}</option>
              <option value="born">{t('cat_born')}</option>
              <option value="erhverv">{t('cat_erhverv')}</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginBottom: 14 }}>
          <div className="field">
            <label className="field-label">{t('name_da')}</label>
            <input className="input" value={form.name_da} onChange={(e) => update('name_da', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">{t('name_en')}</label>
            <input className="input" value={form.name_en} onChange={(e) => update('name_en', e.target.value)} />
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
          </div>
          <div className="field">
            <label className="field-label">{t('desc_en')}</label>
            <textarea className="textarea" rows="5" value={form.desc_en} onChange={(e) => update('desc_en', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="form-section">
        <h3 className="form-section-title">{t('images')}</h3>
        <p className="form-section-desc">{t('images_desc')}</p>

        <div className="image-grid">
          {galleryImages.map((img, i) => {
            const label = i === 0
              ? (lang === 'da' ? 'Hovedbillede' : 'Primary image')
              : (lang === 'da' ? `Galleri ${i}` : `Gallery ${i}`);
            return (
              <div key={i}>
                <div className={`image-tile ${img.primary ? 'primary' : ''} thumb ${img.kind}`}
                  style={{ borderRadius: 'var(--radius-inner)' }} title={label}>
                </div>
                <div className="small muted" style={{ marginTop: 6, textAlign: 'center' }}>{label}</div>
              </div>
            );
          })}
        </div>

        <div className="dropzone">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <I.image />
            <div className="dropzone-title">{t('drop_images')}</div>
            <div className="dropzone-sub">{t('image_types')}</div>
          </div>
        </div>
      </div>

      {/* Internal files */}
      <div className="form-section">
        <div className="flex between items-center mb-3">
          <div>
            <h3 className="form-section-title">🔒 {t('internal_files')}</h3>
            <p className="form-section-desc" style={{ marginBottom: 0 }}>{t('internal_files_desc')}</p>
          </div>
        </div>

        {INTERNAL_FILES.map((f, i) => (
          <div key={i} className="file-row">
            <div className="file-icon">
              {f.name.endsWith('.stl') ? <I.file_3d /> : <I.file_pdf />}
            </div>
            <div className="file-meta">
              <div className="file-name">{f.name}</div>
              <div className="file-sub">{f.size}</div>
            </div>
            <Chip kind="gold">{lang === 'da' ? f.label_da : f.label_en}</Chip>
            <button className="btn btn-ghost" title={t('download') || 'Download'}><I.download /></button>
            <button className="btn btn-ghost"><I.x /></button>
          </div>
        ))}

        <div className="dropzone" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <I.upload />
            <div className="dropzone-title">{t('drop_files')}</div>
            <div className="dropzone-sub">{t('file_types')}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="form-section">
        <h3 className="form-section-title">{t('internal_notes')}</h3>
        <p className="form-section-desc">{t('internal_notes_desc')}</p>
        <textarea className="textarea" rows="5" placeholder={t('notes_placeholder')}
          value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      </div>

      <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary">{t('cancel')}</button>
        <button className="btn btn-primary"><I.check />{t('save')}</button>
      </div>
    </div>
  );
}

window.PageProductEdit = PageProductEdit;
