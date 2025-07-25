/**
 * @jest-environment jsdom
 */

import Templates from '../src/templates'
import * as ExampleTemplates from './fixtures/templates'

const templates = new Templates(ExampleTemplates)

describe('render', () => {
  test('with correct template', () => {
    let result = templates.render('template1')
    expect(result).toBe('<div>default</div>')

    result = templates.render('template1', 'test template')
    expect(result).toBe('<div>test template</div>')

    result = templates.render('template2', { title: 'title' })
    expect(result).toBe('<h1>title</h1>')
  })

  test('with incorrect template', () => {
    expect(() => {
      templates.render('foo')
    }).toThrow("[Ralix] Template 'foo' not found")
  })
})

describe('escapeHTML', () => {
  test('with malicious content', () => {
    const result = templates.escapeHTML('<script>alert("xss")</script>')
    expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;')
  })

  test('with safe content', () => {
    const result = templates.escapeHTML('Hello World')
    expect(result).toBe('Hello World')
  })

  test('with mixed content', () => {
    const result = templates.escapeHTML('Hello <script>alert("xss")</script> World')
    expect(result).toBe('Hello &lt;script&gt;alert("xss")&lt;/script&gt; World')
  })

  test('escape alias function', () => {
    const result = templates.escape('<img src="x" onerror="alert(1)">')
    expect(result).toBe('&lt;img src="x" onerror="alert(1)"&gt;')
  })
})
