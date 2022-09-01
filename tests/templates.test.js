import Template from '../src/templates'
import * as Templates from './templates'

let template

beforeAll(() => {
  template = new Template(Templates)
})

describe('render', () => {
  test('with correct template', () => {
    const element = template.render('divTemplate', 'Test template')

    expect(element).toBe('<div>Test template</div>')
  })

  test('with incorrect template', () => {
    expect(() => {
      template.render('spanTemplate', 'Test template')
    }).toThrow("[Ralix] Template 'spanTemplate' not found")
  })
})
