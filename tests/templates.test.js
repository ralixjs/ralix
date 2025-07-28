/* @jest-environment jsdom */

import Templates from '../src/templates.js'
import Helpers from '../src/helpers.js'
import * as ExampleTemplates from './fixtures/templates'

const templates = new Templates(ExampleTemplates)
const helpers = new Helpers()

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

describe('insertTemplate', () => {
  let container

  beforeEach(() => {
    // Set up App global and DOM container
    window.App = { templates }
    helpers.inject() // Make helper functions globally available
    container = document.createElement('div')
    container.className = 'test-container'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    delete window.App
  })

  test('inserts template with default position (inner)', () => {
    container.innerHTML = '<p>original content</p>'
    
    insertTemplate('.test-container', 'template1', 'inserted content')
    
    expect(container.innerHTML).toBe('<div>inserted content</div>')
  })

  test('inserts template with different positions', () => {
    container.innerHTML = '<p>original</p>'
    
    // Test 'end' position (beforeend)
    insertTemplate('.test-container', 'template1', 'end content', 'end')
    expect(container.innerHTML).toBe('<p>original</p><div>end content</div>')
    
    // Reset and test 'begin' position (afterbegin)
    container.innerHTML = '<p>original</p>'
    insertTemplate('.test-container', 'template1', 'begin content', 'begin')
    expect(container.innerHTML).toBe('<div>begin content</div><p>original</p>')
    
    // Test 'prepend' position (beforebegin)
    const wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="target">target</div>'
    document.body.appendChild(wrapper)
    
    insertTemplate('.target', 'template1', 'prepend content', 'prepend')
    expect(wrapper.innerHTML).toBe('<div>prepend content</div><div class="target">target</div>')
    
    // Test 'append' position (afterend)
    wrapper.innerHTML = '<div class="target">target</div>'
    insertTemplate('.target', 'template1', 'append content', 'append')
    expect(wrapper.innerHTML).toBe('<div class="target">target</div><div>append content</div>')
  })

  test('inserts template with complex data', () => {
    insertTemplate('.test-container', 'template2', { title: 'Test Title' })
    
    expect(container.innerHTML).toBe('<h1>Test Title</h1>')
  })

  test('handles invalid query selector gracefully', () => {
    // Should not throw error when element not found
    expect(() => {
      insertTemplate('.non-existent', 'template1', 'test')
    }).not.toThrow()
    
    // Container should remain unchanged
    expect(container.innerHTML).toBe('')
  })

  test('throws error for invalid template', () => {
    expect(() => {
      insertTemplate('.test-container', 'nonExistentTemplate', 'test')
    }).toThrow("[Ralix] Template 'nonExistentTemplate' not found")
  })

  test('preserves template structure without sanitization', () => {
    // Use the structureTemplate which already has script tags and onclick handlers
    const data = {
      userContent: 'test content',
      userImage: 'test.jpg'
    }
    
    insertTemplate('.test-container', 'structureTemplate', data)
    
    // Should preserve the script tag and onclick handler (template structure)
    expect(container.innerHTML).toContain('<script type="application/json">')
    expect(container.innerHTML).toContain('onclick="handleClick()"')
    expect(container.innerHTML).toContain('onerror="fallback()"')
    expect(container.innerHTML).toContain('test content')
  })

  test('works with null position parameter', () => {
    container.innerHTML = '<p>original</p>'
    
    insertTemplate('.test-container', 'template1', 'test content with empty position', null)
    
    // Should default to 'inner' position
    expect(container.innerHTML).toBe('<div>test content with empty position</div>')
  })
})
