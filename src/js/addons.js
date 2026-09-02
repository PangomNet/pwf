function normalizeManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') throw new TypeError('PWF add-on manifest must be an object.');
  if (!/^[a-z][a-z0-9-]*$/.test(manifest.id || '')) throw new TypeError('PWF add-on id must be lowercase and hyphenated.');
  if (!manifest.version || !manifest.license) throw new TypeError('PWF add-ons require version and license fields.');
  return Object.freeze({
    dependencies: [],
    capabilities: [],
    routes: [],
    settings: [],
    styles: [],
    ...manifest
  });
}

/**
 * Create an application-owned add-on registry. Importing this module has no effect.
 * @param {{capabilities?: string[], events?: EventTarget|null}} options
 */
export function createAddonRegistry({ capabilities = [], events = null } = {}) {
  const allowedCapabilities = new Set(capabilities);
  const entries = new Map();
  const active = new Map();

  function emit(type, detail) {
    events?.dispatchEvent?.(new CustomEvent(type, { detail }));
  }

  function register(manifest, module) {
    const normalized = normalizeManifest(manifest);
    if (entries.has(normalized.id)) throw new Error(`PWF add-on already registered: ${normalized.id}`);
    if (!module || typeof module.activate !== 'function') throw new TypeError('PWF add-on modules require an activate(context) function.');
    entries.set(normalized.id, { manifest: normalized, module });
    emit('pwf:addon-register', { manifest: normalized });
    return normalized;
  }

  async function activate(id, context = {}) {
    const entry = entries.get(id);
    if (!entry) throw new Error(`Unknown PWF add-on: ${id}`);
    if (active.has(id)) return active.get(id).value;
    const missingDependency = entry.manifest.dependencies.find((dependency) => !entries.has(dependency));
    if (missingDependency) throw new Error(`PWF add-on ${id} requires ${missingDependency}.`);
    const deniedCapability = entry.manifest.capabilities.find((capability) => !allowedCapabilities.has(capability));
    if (deniedCapability) throw new Error(`PWF add-on ${id} was not granted capability ${deniedCapability}.`);
    const result = await entry.module.activate(Object.freeze({ manifest: entry.manifest, registry: api, ...context }));
    const record = typeof result === 'function' ? { cleanup: result, value: undefined } : { cleanup: result?.cleanup, value: result?.value };
    active.set(id, record);
    emit('pwf:addon-activate', { manifest: entry.manifest });
    return record.value;
  }

  async function deactivate(id) {
    const record = active.get(id);
    if (!record) return false;
    await record.cleanup?.();
    active.delete(id);
    emit('pwf:addon-deactivate', { id });
    return true;
  }

  function unregister(id) {
    if (active.has(id)) throw new Error(`Deactivate PWF add-on before unregistering: ${id}`);
    return entries.delete(id);
  }

  const api = Object.freeze({
    register,
    unregister,
    activate,
    deactivate,
    get: (id) => entries.get(id)?.manifest || null,
    list: () => [...entries.values()].map(({ manifest }) => manifest),
    isActive: (id) => active.has(id)
  });
  return api;
}
