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
    let testTemplates
    
    beforeEach(() => {
      // Mock templates with potential XSS vulnerabilities
      const xssTestTemplates = {
        userContent: (data) => `<div>User says: ${data.message}</div>`,
        scriptInjection: (data) => `<p>${data.content}</p>`,
        attributeInjection: (data) => `<img src="${data.src}" alt="${data.alt}">`,
        complexTemplate: (data) => `
          <div class="card">
            <h1>${data.title}</h1>
            <p>${data.description}</p>
            <a href="${data.link}">Click here</a>
          </div>
        `
      }
      testTemplates = new Templates(xssTestTemplates)
    })

    test('should sanitize script tags in template output', () => {
      const maliciousData = {
        message: '<script>alert("XSS")</script>Hello'
      }
      
      const result = testTemplates.render('userContent', maliciousData)
      
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('Hello')
    })

    test('should sanitize event handlers in template output', () => {
      const maliciousData = {
        content: '<img src="x" onerror="alert(1)" onload="alert(2)">'
      }
      
      const result = testTemplates.render('scriptInjection', maliciousData)
      
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('onload')
      expect(result).not.toContain('alert(1)')
      expect(result).not.toContain('alert(2)')
      expect(result).toContain('<img src="x">')
    })

    test('should sanitize javascript: URLs in attributes', () => {
      const maliciousData = {
        src: 'javascript:alert("XSS")',
        alt: 'Test image'
      }
      
      const result = testTemplates.render('attributeInjection', maliciousData)
      
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('alt="Test image"')
    })

    test('should sanitize complex XSS attempts', () => {
      const maliciousData = {
        title: '<script>alert("title")</script>Safe Title',
        description: '<img src="x" onerror="alert(1)">Description text',
        link: 'javascript:alert("link")'
      }
      
      const result = testTemplates.render('complexTemplate', maliciousData)
      
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('alert(')
      expect(result).toContain('Safe Title')
      expect(result).toContain('Description text')
    })

    test('should preserve safe HTML elements and content', () => {
      const safeData = {
        message: '<strong>Bold text</strong> and <em>italic text</em>'
      }
      
      const result = testTemplates.render('userContent', safeData)
      
      expect(result).toContain('<strong>Bold text</strong>')
      expect(result).toContain('<em>italic text</em>')
      expect(result).toContain('<div>User says:')
    })

    test('should handle mixed safe and dangerous content', () => {
      const mixedData = {
        content: '<p>Safe paragraph</p><script>alert("XSS")</script><strong>Bold text</strong>'
      }
      
      const result = testTemplates.render('scriptInjection', mixedData)
      
      expect(result).toContain('<p>Safe paragraph</p>')
      expect(result).toContain('<strong>Bold text</strong>')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert("XSS")')
    })

    test('should handle null and undefined values safely', () => {
      const nullData = { message: null }
      const undefinedData = { message: undefined }
      
      const result1 = testTemplates.render('userContent', nullData)
      const result2 = testTemplates.render('userContent', undefinedData)
      
      expect(result1).toContain('<div>User says: ')
      expect(result2).toContain('<div>User says: ')
      expect(result1).not.toContain('null')
      expect(result2).not.toContain('undefined')
    })

    test('should sanitize data URLs that could be malicious', () => {
      const maliciousData = {
        src: 'data:text/html,<script>alert("XSS")</script>',
        alt: 'Test'
      }
      
      const result = testTemplates.render('attributeInjection', maliciousData)
      
      // DOMPurify should sanitize malicious data URLs and script content
      expect(result).not.toContain('alert("XSS")')
      expect(result).not.toContain('<script>alert("XSS")</script>')
    })
  })
})
