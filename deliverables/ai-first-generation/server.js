const express = require('express');
const cors = require('cors');
const path = require('node:path');

const DEFAULT_BOXES = [
  { id: 1, content: 'Apple - 苹果', image: null, drawn: false },
  { id: 2, content: 'Banana - 香蕉', image: null, drawn: false },
  { id: 3, content: 'Cat - 猫', image: null, drawn: false }
];

function normalizeBox(box) {
  return {
    id: Number(box.id),
    content: String(box.content ?? ''),
    image: box.image ?? null,
    drawn: Boolean(box.drawn)
  };
}

function createStore(initialBoxes = DEFAULT_BOXES) {
  const boxes = initialBoxes.map(normalizeBox);
  let nextId = boxes.reduce((maxId, box) => Math.max(maxId, box.id), 0) + 1;

  return {
    list() {
      return boxes.map((box) => ({ ...box }));
    },

    create(input) {
      const box = normalizeBox({
        id: nextId++,
        content: input.content,
        image: input.image,
        drawn: false
      });
      boxes.push(box);
      return { ...box };
    },

    update(id, input) {
      const box = boxes.find((item) => item.id === id);
      if (!box) return null;

      box.content = String(input.content ?? '');
      box.image = input.image ?? null;
      return { ...box };
    },

    delete(id) {
      const index = boxes.findIndex((box) => box.id === id);
      if (index === -1) return false;
      boxes.splice(index, 1);
      return true;
    },

    draw() {
      const candidates = boxes.filter((box) => !box.drawn);
      if (candidates.length === 0) return null;

      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      selected.drawn = true;
      return { ...selected };
    },

    resetDrawn() {
      boxes.forEach((box) => {
        box.drawn = false;
      });
    }
  };
}

function createApp(store = createStore()) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.static(__dirname));

  app.get('/api/boxes', (_req, res) => {
    res.json(store.list());
  });

  app.post('/api/boxes', (req, res) => {
    res.status(201).json(store.create(req.body ?? {}));
  });

  app.put('/api/boxes/:id', (req, res) => {
    const id = Number(req.params.id);
    const box = store.update(id, req.body ?? {});
    if (!box) {
      res.status(404).json({ error: '盲盒不存在' });
      return;
    }
    res.json(box);
  });

  app.delete('/api/boxes/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!store.delete(id)) {
      res.status(404).json({ error: '盲盒不存在' });
      return;
    }
    res.json({ deleted: true });
  });

  app.post('/api/draw', (_req, res) => {
    const box = store.draw();
    if (!box) {
      res.status(409).json({ error: '没有可抽取的盲盒' });
      return;
    }
    res.json(box);
  });

  app.post('/api/draw/reset', (_req, res) => {
    store.resetDrawn();
    res.json({ reset: true });
  });

  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`English blind box server listening on http://localhost:${port}`);
  });
}

module.exports = { createApp, createStore };
