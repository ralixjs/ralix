/* @jest-environment jsdom */

import Templates from '../src/templates'
import Helpers from '../src/helpers'

const helpers = new Helpers()
helpers.inject()

describe('Security Tests', () => {
  describe('Template XSS Protection', () => {
    let templates
    
    beforeEach(() => {
      // Mock templates with potential XSS vulnerabilities
      const testTemplates = {
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
      templates = new Templates(testTemplates)
    })

    test('should sanitize script tags in template output', () => {
      const maliciousData = {
        message: '<script>alert("XSS")</script>Hello'
      }
      
      const result = templates.render('userContent', maliciousData)
      
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('Hello')
    })

    test('should sanitize event handlers in template output', () => {
      const maliciousData = {
        content: '<img src="x" onerror="alert(1)" onload="alert(2)">'
      }
      
      const result = templates.render('scriptInjection', maliciousData)
      
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
      
      const result = templates.render('attributeInjection', maliciousData)
      
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
      
      const result = templates.render('complexTemplate', maliciousData)
      
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
      
      const result = templates.render('userContent', safeData)
      
      expect(result).toContain('<strong>Bold text</strong>')
      expect(result).toContain('<em>italic text</em>')
      expect(result).toContain('<div>User says:')
    })

    test('should handle mixed safe and dangerous content', () => {
      const mixedData = {
        content: '<p>Safe paragraph</p><script>alert("XSS")</script><strong>Bold text</strong>'
      }
      
      const result = templates.render('scriptInjection', mixedData)
      
      expect(result).toContain('<p>Safe paragraph</p>')
      expect(result).toContain('<strong>Bold text</strong>')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert("XSS")')
    })

    test('should handle null and undefined values safely', () => {
      const nullData = { message: null }
      const undefinedData = { message: undefined }
      
      const result1 = templates.render('userContent', nullData)
      const result2 = templates.render('userContent', undefinedData)
      
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
      
      const result = templates.render('attributeInjection', maliciousData)
      
      // DOMPurify should sanitize malicious data URLs and script content
      expect(result).not.toContain('alert("XSS")')
      expect(result).not.toContain('<script>alert("XSS")</script>')
    })
  })

  describe('Render Helper Global Function', () => {
    beforeEach(() => {
      // Mock global App object with templates
      window.App = {
        templates: new Templates({
          testTemplate: (data) => `<div>${data.content}</div>`
        })
      }
    })

    test('should sanitize XSS in render helper', () => {
      const maliciousContent = '<script>alert("XSS")</script>Safe content'
      
      const result = render('testTemplate', { content: maliciousContent })
      
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('Safe content')
    })
  })

  describe('Integration with insertHTML', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test-container"></div>'
      
      window.App = {
        templates: new Templates({
          maliciousTemplate: (data) => `<div>${data.userInput}</div>`
        })
      }
    })

    test('should be safe when using render with insertHTML', () => {
      const maliciousInput = '<script>alert("XSS")</script>Content'
      
      const renderedTemplate = render('maliciousTemplate', { userInput: maliciousInput })
      insertHTML('#test-container', renderedTemplate)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).not.toContain('<script>')
      expect(container.innerHTML).not.toContain('alert("XSS")')
      expect(container.innerHTML).toContain('Content')
    })
  })
})