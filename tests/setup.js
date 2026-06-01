import { serialize, deserialize } from 'node:v8'

// jsdom, DOM globals and the page URL are provided by Vitest's jsdom environment
// (see vitest.config.js). Only project-specific setup lives here.

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => deserialize(serialize(obj))
}
