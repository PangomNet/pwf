import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPreferences, createPreferenceController, normalizePreferences } from '../src/js/preferences.js';

function fakeRoot() {
  const properties = new Map();
  return {
    dataset: {},
    style: {
      setProperty(name, value) { properties.set(name, value); },
      getPropertyValue(name) { return properties.get(name); }
    }
  };
}

test('normalizes untrusted preferences and clamps scale', () => {
  assert.deepEqual(normalizePreferences({
    colorScheme: 'neon', contrast: 'more', motion: 'reduce', scale: 9
  }), {
    colorScheme: 'auto', contrast: 'more', motion: 'reduce', scale: 1.5
  });
});

test('applies preferences without persistence', () => {
  const root = fakeRoot();
  const applied = applyPreferences({ colorScheme: 'dark', scale: 1.2 }, root);
  assert.equal(root.dataset.pwfColorScheme, 'dark');
  assert.equal(root.dataset.pwfContrast, 'auto');
  assert.equal(root.style.getPropertyValue('--pwf-ui-scale'), '1.2');
  assert.equal(applied.motion, 'auto');
});

test('persistence is opt-in through an injected adapter', () => {
  const data = new Map();
  const storage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key)
  };
  const controller = createPreferenceController({ root: fakeRoot(), storage });
  controller.set({ contrast: 'more' });
  assert.equal(controller.read().contrast, 'more');
  controller.clear();
  assert.equal(data.size, 0);
});
