// Data hooks for admin-v2.
// Joins products.json (static, public) with admin-stats.js (Stripe-aggregated, admin-gated).
// Module-level cache survives page navigation; refresh() busts cache manually.

const CATEGORY_SLUG = {
  'Børn': 'born',
  'Voksne': 'voksne',
  'Erhverv': 'erhverv',
};

const CATEGORY_DISPLAY = {
  'born': 'Børn',
  'voksne': 'Voksne',
  'erhverv': 'Erhverv',
};

function remapProduct(p) {
  return {
    sku: p.sku,
    name_da: p.title,
    name_en: p.title_en || p.title,
    price: p.price,
    category: CATEGORY_SLUG[p.category] || 'voksne',
    desc_da: p.description,
    desc_en: p.description_en || p.description,
    visible: p.published !== false,
    files: p.internal_files_count || 0,
    image: p.image || null,
    images: Array.isArray(p.images) ? p.images : [],
    weight_grams: typeof p.weight_grams === 'number' ? p.weight_grams : undefined,
    length_cm: typeof p.length_cm === 'number' ? p.length_cm : undefined,
    width_cm: typeof p.width_cm === 'number' ? p.width_cm : undefined,
    height_cm: typeof p.height_cm === 'number' ? p.height_cm : undefined,
    slug: p.slug,
  };
}

// Write-direction adapter: form-state → 3.1a contract fields per
// docs/3.1b-product-edit-form-contract.md. SKU + slug sent at top level.
// image/extra_images excluded (W4 Cloudinary).
function formToFields(form) {
  return {
    title: form.name_da,
    title_en: form.name_en,
    description: form.desc_da,
    description_en: form.desc_en,
    price: parseInt(form.price, 10),
    category: CATEGORY_DISPLAY[form.category],
    published: form.visible,
    internal_notes: form.notes,
    ...(form.weight_grams !== '' && { weight_grams: parseInt(form.weight_grams, 10) }),
    ...(form.length_cm !== '' && { length_cm: parseInt(form.length_cm, 10) }),
    ...(form.width_cm !== '' && { width_cm: parseInt(form.width_cm, 10) }),
    ...(form.height_cm !== '' && { height_cm: parseInt(form.height_cm, 10) }),
  };
}

// ---- products cache + loader ----

let productsCache = { data: null, error: null };
let productsPromise = null;

function loadProducts() {
  if (productsPromise) return productsPromise;
  productsPromise = (async () => {
    try {
      const res = await fetch('/products.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      productsCache = { data: raw.map(remapProduct), error: null };
    } catch (err) {
      productsCache = { data: null, error: err.message || 'Load failed' };
    }
  })();
  return productsPromise;
}

// Sync productsCache after save so subsequent mounts don't show stale data.
function updateCachedProduct(sku, formState) {
  if (!productsCache.data) return;
  const idx = productsCache.data.findIndex(p => p.sku === sku);
  if (idx === -1) return;
  productsCache.data = productsCache.data.map((p, i) =>
    i !== idx ? p : {
      ...p,
      name_da: formState.name_da,
      name_en: formState.name_en,
      price: parseInt(formState.price, 10),
      category: formState.category,
      visible: formState.visible,
      desc_da: formState.desc_da,
      desc_en: formState.desc_en,
      weight_grams: (formState.weight_grams ?? '') !== '' ? parseInt(formState.weight_grams, 10) : undefined,
      length_cm: (formState.length_cm ?? '') !== '' ? parseInt(formState.length_cm, 10) : undefined,
      width_cm: (formState.width_cm ?? '') !== '' ? parseInt(formState.width_cm, 10) : undefined,
      height_cm: (formState.height_cm ?? '') !== '' ? parseInt(formState.height_cm, 10) : undefined,
    }
  );
}

// ---- stats cache + loader ----

let statsCache = { data: null, error: null };
let statsPromise = null;

function loadStats() {
  if (statsPromise) return statsPromise;
  statsPromise = (async () => {
    try {
      const res = await fetch('/.netlify/functions/admin-stats', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.status === 401) {
        throw new Error('Session udløbet — log ind igen');
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      statsCache = { data: await res.json(), error: null };
    } catch (err) {
      statsCache = { data: null, error: err.message || 'Load failed' };
    }
  })();
  return statsPromise;
}

// ---- hooks ----

function useProducts() {
  const [state, setState] = React.useState(productsCache);

  React.useEffect(() => {
    let mounted = true;
    loadProducts().then(() => {
      if (mounted) setState(productsCache);
    });
    return () => { mounted = false; };
  }, []);

  return {
    data: state.data,
    loading: state.data === null && state.error === null,
    error: state.error,
    refresh: () => {
      productsCache = { data: null, error: null };
      productsPromise = null;
      setState(productsCache);
      loadProducts().then(() => setState(productsCache));
    },
  };
}

function useStats() {
  const [state, setState] = React.useState(statsCache);

  React.useEffect(() => {
    let mounted = true;
    loadStats().then(() => {
      if (mounted) setState(statsCache);
    });
    return () => { mounted = false; };
  }, []);

  return {
    data: state.data,
    loading: state.data === null && state.error === null,
    error: state.error,
    refresh: () => {
      statsCache = { data: null, error: null };
      statsPromise = null;
      setState(statsCache);
      loadStats().then(() => setState(statsCache));
    },
  };
}

window.useProducts = useProducts;
window.useStats = useStats;
window.formToFields = formToFields;
window.updateCachedProduct = updateCachedProduct;
