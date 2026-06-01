import { serialize, deserialize } from 'node:v8'
import { JSDOM, VirtualConsole } from 'jsdom'

const virtualConsole = new VirtualConsole()
virtualConsole.forwardTo(console, { jsdomErrors: 'none' })
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://example.com/',
  virtualConsole
})

globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.location = dom.window.location
globalThis.history = dom.window.history

Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true
})

for (const name of [
  'CSSStyleDeclaration',
  'Element',
  'Event',
  'FormData',
  'HTMLFormElement',
  'HTMLElement',
  'Node',
  'NodeList',
  'URL',
  'URLSearchParams'
]) {
  globalThis[name] = dom.window[name]
}

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => deserialize(serialize(obj))
}
