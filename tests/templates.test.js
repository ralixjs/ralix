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

  describe('XSS Protection', () => {
    test('should sanitize javascript: URLs in attributes', () => {
      const maliciousData = {
        src: 'javascript:alert("XSS")',
        alt: 'Test image'
      }

      const result = templates.render('attributeInjection', maliciousData)

      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('alt="Test image"')
    })

    test('should preserve template structure while sanitizing only variables', () => {
      const data = {
        userContent: '<script>alert("XSS")</script>Safe content',
        userImage: 'javascript:alert("XSS")'
      }

      const result = templates.render('structureTemplate', data)

      // Template structure should be preserved
      expect(result).toContain('<script type="application/json">')
      expect(result).toContain('onclick="handleClick()"')
      expect(result).toContain('onerror="fallback()"')

      // But user variables should be sanitized
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('Safe content')
      expect(result).toContain('<img src="" onerror="fallback()">')
    })

    test('should sanitize nested object variables', () => {
      const data = {
        user: {
          name: '<script>alert("name")</script>John',
          profile: {
            bio: '<img onerror="alert(1)" src="x">Developer'
          }
        },
        items: [
          '<script>alert("item1")</script>Item 1',
          'javascript:alert("item2")',
          'Safe item'
        ]
      }

      const result = templates.render('nestedTemplate', data)

      // Scripts should be removed from variables
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert(')
      expect(result).not.toContain('javascript:')

      // Safe content should be preserved
      expect(result).toContain('John')
      expect(result).toContain('Developer')
      expect(result).toContain('Safe item')
      expect(result).toContain('<img src="x">')
    })

    test('should handle primitive values in data', () => {
      const data = {
        message: '<script>alert("XSS")</script>Hello',
        count: 42,
        isActive: true,
        nullValue: null,
        undefinedValue: undefined
      }

      const result = templates.render('primitiveTemplate', data)

      expect(result).not.toContain('<script>')
      expect(result).toContain('Hello')
      expect(result).toContain('Count: 42')
      expect(result).toContain('Active: true')
      expect(result).toContain('Null: ')
      expect(result).toContain('Undefined: ')
    })
  })
})
