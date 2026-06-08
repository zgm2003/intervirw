const assert = require('node:assert/strict');
const test = require('node:test');

const { createApp, createStore } = require('../server');

function startTestServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function stopTestServer(server) {
  await new Promise((resolve) => server.close(resolve));
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });
  const data = await response.json();
  return { response, data };
}

test('boxes API lists, creates, updates, and deletes blind boxes', async () => {
  const store = createStore([
    { id: 1, content: 'Apple - 苹果', image: null, drawn: false }
  ]);
  const app = createApp(store);
  const { server, baseUrl } = await startTestServer(app);

  try {
    const list = await requestJson(baseUrl, '/api/boxes');
    assert.equal(list.response.status, 200);
    assert.equal(list.response.headers.get('access-control-allow-origin'), '*');
    assert.deepEqual(list.data, [
      { id: 1, content: 'Apple - 苹果', image: null, drawn: false }
    ]);

    const created = await requestJson(baseUrl, '/api/boxes', {
      method: 'POST',
      body: JSON.stringify({ content: 'Banana - 香蕉', image: 'data:image/png;base64,abc' })
    });
    assert.equal(created.response.status, 201);
    assert.deepEqual(created.data, {
      id: 2,
      content: 'Banana - 香蕉',
      image: 'data:image/png;base64,abc',
      drawn: false
    });

    const updated = await requestJson(baseUrl, '/api/boxes/2', {
      method: 'PUT',
      body: JSON.stringify({ content: 'Cat - 猫', image: null })
    });
    assert.equal(updated.response.status, 200);
    assert.deepEqual(updated.data, {
      id: 2,
      content: 'Cat - 猫',
      image: null,
      drawn: false
    });

    const deleted = await requestJson(baseUrl, '/api/boxes/1', { method: 'DELETE' });
    assert.equal(deleted.response.status, 200);
    assert.deepEqual(deleted.data, { deleted: true });

    const afterDelete = await requestJson(baseUrl, '/api/boxes');
    assert.deepEqual(afterDelete.data, [
      { id: 2, content: 'Cat - 猫', image: null, drawn: false }
    ]);
  } finally {
    await stopTestServer(server);
  }
});

test('draw API returns one undrawn box and rejects drawing when none remain', async () => {
  const store = createStore([
    { id: 1, content: 'Only one', image: null, drawn: false }
  ]);
  const app = createApp(store);
  const { server, baseUrl } = await startTestServer(app);

  try {
    const firstDraw = await requestJson(baseUrl, '/api/draw', { method: 'POST' });
    assert.equal(firstDraw.response.status, 200);
    assert.deepEqual(firstDraw.data, {
      id: 1,
      content: 'Only one',
      image: null,
      drawn: true
    });

    const listAfterDraw = await requestJson(baseUrl, '/api/boxes');
    assert.deepEqual(listAfterDraw.data, [
      { id: 1, content: 'Only one', image: null, drawn: true }
    ]);

    const secondDraw = await requestJson(baseUrl, '/api/draw', { method: 'POST' });
    assert.equal(secondDraw.response.status, 409);
    assert.deepEqual(secondDraw.data, { error: '没有可抽取的盲盒' });
  } finally {
    await stopTestServer(server);
  }
});
