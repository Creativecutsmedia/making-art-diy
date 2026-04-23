const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Whitelist of allowed upload folders. Prevents folder-injection via request body.
const ALLOWED_FOLDERS = new Set([
  'test-poc-3.0b',
  'products',
]);

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload, null, 2),
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
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

  // Parse body — widget sends the exact params it will upload with.
  let paramsToSign;
  try {
    paramsToSign = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  // Folder validation — reject anything not in whitelist.
  // Checked BEFORE signing so an attacker cannot trick us into signing
  // uploads to folders we don't own.
  if (!paramsToSign.folder || !ALLOWED_FOLDERS.has(paramsToSign.folder)) {
    return jsonResponse(400, {
      error: 'Folder not allowed',
      folder: paramsToSign.folder,
      allowed: [...ALLOWED_FOLDERS],
    });
  }

  // Sign the full params set the widget will upload with.
  // cloudinary.utils.api_sign_request sorts alphabetically and appends api_secret.
  const signature = cloudinary.utils.api_sign_request(paramsToSign, API_SECRET);

  console.log(`[cloudinary-sign] signed folder=${paramsToSign.folder} user=${user.email || user.sub}`);

  return jsonResponse(200, { signature });
};
