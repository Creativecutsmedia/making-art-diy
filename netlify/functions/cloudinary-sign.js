const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Whitelist of allowed upload folders. Prevents folder-injection via query param.
// Grows as new features need dedicated folders (products for Fase 2-3, etc.).
const ALLOWED_FOLDERS = new Set([
  'test-poc-3.0b',
  'products',
]);
const DEFAULT_FOLDER = 'test-poc-3.0b';

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload, null, 2),
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  // Auth: authenticated Netlify Identity user with 'admin' role required.
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }
  const roles = (user.app_metadata && user.app_metadata.roles) || [];
  if (!roles.includes('admin')) {
    return jsonResponse(403, { error: 'Forbidden — admin role required' });
  }

  // Env var sanity check — fail fast with diagnostic info if misconfigured.
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('[cloudinary-sign] missing env vars');
    return jsonResponse(500, {
      error: 'Cloudinary env vars missing',
      has_cloud_name: !!CLOUD_NAME,
      has_api_key: !!API_KEY,
      has_api_secret: !!API_SECRET,
    });
  }

  // Folder validation — reject anything not in whitelist.
  const folder = (event.queryStringParameters && event.queryStringParameters.folder) || DEFAULT_FOLDER;
  if (!ALLOWED_FOLDERS.has(folder)) {
    return jsonResponse(400, {
      error: 'Folder not allowed',
      folder,
      allowed: [...ALLOWED_FOLDERS],
    });
  }

  // Generate signed upload params. Signature locks folder+timestamp so the widget
  // cannot upload to a different folder or replay after a long delay.
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, API_SECRET);

  console.log(`[cloudinary-sign] signed folder=${folder} user=${user.email || user.sub}`);

  return jsonResponse(200, {
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    timestamp,
    signature,
    folder,
  });
};
