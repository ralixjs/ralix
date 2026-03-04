/* @jest-environment jsdom */

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
