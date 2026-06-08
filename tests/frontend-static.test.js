const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const path = require('node:path');

test('index.html wires the required REST endpoints into the existing script', () => {
  const html = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  assert.match(html, /async function loadBoxesFromServer\(\)/);
  assert.match(html, /async function updateBoxToServer\(box\)/);
  assert.match(html, /async function createBoxOnServer\(box\)/);
  assert.match(html, /async function deleteBoxFromServer\(boxId\)/);
  assert.match(html, /async function drawBoxFromServer\(\)/);
  assert.match(html, /apiRequest\('\/boxes'/);
  assert.match(html, /apiRequest\('\/draw'/);
});

test('draw click handler no longer references an undefined boxId variable', () => {
  const html = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const match = html.match(/function handleBoxClick\(index\) \{([\s\S]*?)\n\s*\}/);

  assert.ok(match, 'handleBoxClick(index) should exist');
  assert.doesNotMatch(match[1], /\bboxId\b/);
});

test('page initialization loads boxes from the backend before rendering', () => {
  const html = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  assert.match(html, /async function initializeApp\(\)/);
  assert.match(html, /await loadBoxesFromServer\(\)/);
  assert.match(html, /initializeApp\(\);/);
});
