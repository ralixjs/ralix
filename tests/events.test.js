import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import Helpers from '../src/helpers.js'
import Events from '../src/events.js'

new Helpers().inject()

const events = new Events()
// Vitest's jsdom window does not enumerate its on* handlers, so the constructor finds none
events.availableEvents = ['[onchange]', '[onclick]']

beforeEach(() => {
  globalThis.App = {}
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('bind', () => {
  test('inline handler runs with the element as this', () => {
    document.body.innerHTML = '<select onchange="this.dataset.changed = \'\'"></select>'
    const select = find('select')

    events.bind()
    select.dispatchEvent(new Event('change'))

    expect(select.onchange).toBeNull()
    expect(select.dataset.changed).toBe('')
  })

  test('inline handler receives the event', () => {
    document.body.innerHTML = '<button onclick="event.target.dataset.eventType = event.type"></button>'
    const button = find('button')

    events.bind()
    button.dispatchEvent(new Event('click'))

    expect(button.onclick).toBeNull()
    expect(button.dataset.eventType).toBe('click')
  })
})
