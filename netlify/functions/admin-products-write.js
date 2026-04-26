const matter = require('gray-matter');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_OWNER = 'Creativecutsmedia';
const GITHUB_REPO = 'making-art-diy';
const GITHUB_BRANCH = 'master';
const BUILD_ETA_SECONDS = 60;

const VALID_CATEGORIES = ['Børn', 'Voksne', 'Erhverv'];

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

function validateMerged(data) {
  const errors = {};

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    errors.title = 'must be a non-empty string';
  }
  if (typeof data.price !== 'number' || !Number.isInteger(data.price) || data.price < 0) {
    errors.price = 'must be a non-negative integer';
  }
  if (!VALID_CATEGORIES.includes(data.category)) {
    errors.category = `must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }
  if (typeof data.description !== 'string' || data.description.trim() === '') {
    errors.description = 'must be a non-empty string';
  }

  if (data.title_en !== undefined && typeof data.title_en !== 'string') {
    errors.title_en = 'must be a string';
  }
  if (data.description_en !== undefined && typeof data.description_en !== 'string') {
    errors.description_en = 'must be a string';
  }
  if (data.image !== undefined && typeof data.image !== 'string') {
    errors.image = 'must be a string';
  }
  if (data.extra_images !== undefined) {
    if (
      !Array.isArray(data.extra_images) ||
      !data.extra_images.every((s) => typeof s === 'string')
    ) {
      errors.extra_images = 'must be a list of strings';
    }
  }
  if (data.published !== undefined && typeof data.published !== 'boolean') {
    errors.published = 'must be a boolean';
  }
  if (data.internal_notes !== undefined && typeof data.internal_notes !== 'string') {
    errors.internal_notes = 'must be a string';
  }

  return errors;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'method_not_allowed' });
  }

  // Step 1: parse body + top-level shape check
  let body;
  try {
    body = JSON.parse(event.body || '');
  } catch {
    return jsonResponse(400, { ok: false, error: 'invalid_request' });
  }
  const { slug, sku, fields } = body;
  if (
    typeof slug !== 'string' ||
    typeof sku !== 'string' ||
    !fields ||
    typeof fields !== 'object' ||
    Array.isArray(fields)
  ) {
    return jsonResponse(400, { ok: false, error: 'invalid_request' });
  }
  // SKU is immutable identifier — fields.sku is a client bug, fail loud
  if ('sku' in fields) {
    return jsonResponse(400, { ok: false, error: 'invalid_request' });
  }

  // Step 2: auth (Netlify Identity session)
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return jsonResponse(401, { ok: false, error: 'unauthorized' });
  }

  // Step 3: explicit admin-role-check
  // Functions are publicly addressable for any Identity user; edge-guard only
  // covers /admin-v2/*. Write endpoints with side-effects need their own check.
  const roles = (user.app_metadata && user.app_metadata.roles) || [];
  if (!roles.includes('admin')) {
    return jsonResponse(403, { ok: false, error: 'forbidden' });
  }

  console.log(
    `[admin-products-write] user=${user.email || user.sub} slug=${slug} sku=${sku}`
  );

  const token = process.env.GITHUB_PAT;
  if (!token) {
    console.error('[admin-products-write] GITHUB_PAT missing');
    return jsonResponse(500, { ok: false, error: 'internal_error' });
  }

  const path = `_products/${slug}.md`;
  const getUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const putUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'making-art-diy-admin',
    Accept: 'application/vnd.github+json',
  };

  try {
    // Step 4: GET file
    const getRes = await fetch(getUrl, { headers: ghHeaders });
    if (getRes.status === 404) {
      return jsonResponse(404, { ok: false, error: 'product_not_found' });
    }
    if (getRes.status === 429) {
      return jsonResponse(429, { ok: false, error: 'rate_limited' });
    }
    if (!getRes.ok) {
      console.error(`[admin-products-write] GitHub GET ${getRes.status}`);
      return jsonResponse(502, { ok: false, error: 'github_error' });
    }
    const fileData = await getRes.json();
    const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const currentSha = fileData.sha;

    // Step 5: gray-matter parse
    const parsed = matter(decoded);
    const existingData = parsed.data;
    const bodyContent = parsed.content;

    // Step 6: SKU sanity-check
    if (existingData.sku !== sku) {
      return jsonResponse(409, {
        ok: false,
        error: 'sku_mismatch',
        details: { expected: existingData.sku, received: sku },
      });
    }

    // Step 7: shallow merge — drop sku key defensively even though we already
    // rejected it at input; merging request sku onto frontmatter would silently
    // change the immutable identifier if step 1 ever regressed.
    const merged = { ...existingData };
    for (const [k, v] of Object.entries(fields)) {
      if (k === 'sku') continue;
      merged[k] = v;
    }

    // Step 8: whitelist-validate merged
    const errors = validateMerged(merged);
    if (Object.keys(errors).length > 0) {
      return jsonResponse(400, {
        ok: false,
        error: 'validation_failed',
        details: { fields: errors },
      });
    }

    // Step 9: re-stringify; gray-matter emits 2 trailing newlines, strip to 1
    const newContent = matter.stringify(bodyContent, merged).replace(/\n+$/, '\n');

    // Step 10: PUT to GitHub Contents API
    const putBody = {
      message: `admin: update product ${sku} via admin-v2`,
      content: Buffer.from(newContent, 'utf-8').toString('base64'),
      sha: currentSha,
      branch: GITHUB_BRANCH,
    };
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(putBody),
    });

    if (putRes.status === 409) {
      return jsonResponse(409, { ok: false, error: 'concurrent_write' });
    }
    if (putRes.status === 429) {
      return jsonResponse(429, { ok: false, error: 'rate_limited' });
    }
    if (putRes.status >= 500) {
      console.error(`[admin-products-write] GitHub PUT ${putRes.status}`);
      return jsonResponse(502, { ok: false, error: 'github_error' });
    }
    if (!putRes.ok) {
      const errText = await putRes.text().catch(() => '');
      console.error(
        `[admin-products-write] GitHub PUT unexpected ${putRes.status} ${errText}`
      );
      return jsonResponse(502, { ok: false, error: 'github_error' });
    }

    const putData = await putRes.json();
    const newSha = putData.content && putData.content.sha;

    console.log(
      `[admin-products-write] success slug=${slug} sku=${sku} new_sha=${newSha}`
    );

    // Step 11: 200 response
    // Step 12: Netlify auto-trigger build runs out of band on the master push
    return jsonResponse(200, {
      ok: true,
      slug,
      sku,
      new_sha: newSha,
      build_eta_seconds: BUILD_ETA_SECONDS,
    });
  } catch (err) {
    console.error('[admin-products-write] internal error:', err.message);
    return jsonResponse(500, { ok: false, error: 'internal_error' });
  }
};
