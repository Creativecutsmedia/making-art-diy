const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'admin-poc-temp';

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

  console.log(`[blobs-poc] request from user=${user.email || user.sub}`);

  const t_start = Date.now();
  const steps = [];

  // Wraps a single step: times it, records success/failure, rethrows on error.
  const runStep = async (op, fn) => {
    const t0 = Date.now();
    try {
      const value = await fn();
      const step = { op, ok: true, duration_ms: Date.now() - t0 };
      if (value !== undefined) step.value = value;
      steps.push(step);
      return value;
    } catch (err) {
      steps.push({ op, ok: false, duration_ms: Date.now() - t0, error: err.message });
      throw err;
    }
  };

  try {
    const store = await runStep('getStore', () => getStore(STORE_NAME));

    // Initial cleanup — delete any residual keys from a previous failed run.
    await runStep('cleanup (initial)', async () => {
      const { blobs } = await store.list();
      const keys = blobs.map(b => b.key);
      await Promise.all(keys.map(k => store.delete(k)));
      return { cleaned: keys.length, keys };
    });

    await runStep('set(test-str)', () => store.set('test-str', 'hello blobs'));
    await runStep('get(test-str)', () => store.get('test-str'));
    await runStep('setJSON(test-obj)', () => store.setJSON('test-obj', { n: 42, msg: 'hej' }));
    await runStep('get(test-obj, json)', () => store.get('test-obj', { type: 'json' }));

    await runStep('list()', async () => {
      const { blobs } = await store.list();
      return { count: blobs.length, keys: blobs.map(b => b.key).sort() };
    });

    await runStep('delete(test-str)', () => store.delete('test-str'));
    await runStep('delete(test-obj)', () => store.delete('test-obj'));

    await runStep('list() final', async () => {
      const { blobs } = await store.list();
      return { count: blobs.length };
    });

    console.log(`[blobs-poc] all ${steps.length} steps passed total_duration_ms=${Date.now() - t_start}`);

    return jsonResponse(200, {
      ok: true,
      store: STORE_NAME,
      total_duration_ms: Date.now() - t_start,
      steps,
    });
  } catch (err) {
    const failed_at = steps[steps.length - 1]?.op || 'unknown';
    console.error(`[blobs-poc] failed at step=${failed_at}: ${err.message}`);
    return jsonResponse(500, {
      ok: false,
      store: STORE_NAME,
      failed_at,
      total_duration_ms: Date.now() - t_start,
      steps,
    });
  }
};
