import { serialize, deserialize } from 'node:v8'

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => deserialize(serialize(obj))
}
