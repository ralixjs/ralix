import { serialize, deserialize } from 'node:v8'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://example.com/'
})

globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.navigator = dom.window.navigator
globalThis.location = dom.window.location
globalThis.history = dom.window.history

for (const name of [
  'CSSStyleDeclaration',
  'Element',
  'Event',
  'FormData',
  'HTMLFormElement',
  'HTMLElement',
  'Node',
  'URL',
  'URLSearchParams'
]) {
  globalThis[name] = dom.window[name]
}

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => deserialize(serialize(obj))
}
