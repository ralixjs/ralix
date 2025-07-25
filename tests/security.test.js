/**
 * @jest-environment jsdom
 */

import Helpers from '../src/helpers'

// Create a global App object for testing
global.App = {
  currentElement: null,
  currentEvent: null,
  templates: {
    render: () => '<div>test</div>'
  }
}

// Create helper instance and inject methods globally
const helpers = new Helpers()
helpers.inject()

describe('Security - XSS Prevention', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>'
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Vulnerability demonstration (existing behavior)', () => {
    test('insertHTML should still work with legitimate HTML for backward compatibility', () => {
      const legitimateHTML = '<div class="content"><span>Hello World</span></div>'
      
      insertHTML('#test-container', legitimateHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('<div class="content"><span>Hello World</span></div>')
      expect(container.querySelector('.content')).toBeTruthy()
    })

    test('insertHTML is vulnerable to XSS (demonstrates need for security fix)', () => {
      const maliciousHTML = '<img src="x" onerror="window.xssExecuted = true">'
      
      insertHTML('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toContain('onerror="window.xssExecuted = true"')
      // This demonstrates the vulnerability exists in the original API
    })

    test('insertHTMLUnsafe should be explicitly vulnerable', () => {
      const maliciousHTML = '<script>window.xssExecuted = true;</script><div>content</div>'
      
      insertHTMLUnsafe('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toContain('<script>')
      expect(container.innerHTML).toContain('window.xssExecuted = true')
    })
  })

  describe('Security fix with new safe API', () => {
    test('insertHTMLSafe should escape malicious script tags', () => {
      const maliciousHTML = '<script>alert("XSS")</script>'
      
      insertHTMLSafe('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;')
      expect(container.innerHTML).not.toContain('<script>')
    })

    test('insertHTMLSafe should escape malicious event handlers', () => {
      const maliciousHTML = '<img src="x" onerror="alert(1)">'
      
      insertHTMLSafe('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('&lt;img src="x" onerror="alert(1)"&gt;')
      expect(container.innerHTML).not.toContain('<img')
      expect(container.querySelector('img')).toBeNull() // No actual img element created
    })

    test('insertHTMLSafe should work with all positions safely', () => {
      document.body.innerHTML = '<div id="target">existing</div>'
      const maliciousHTML = '<script>alert(1)</script>'
      
      insertHTMLSafe('#target', maliciousHTML, 'end')
      expect(document.getElementById('target').innerHTML).toContain('&lt;script&gt;')
      expect(document.getElementById('target').innerHTML).not.toContain('<script>')
    })

    test('escapeHTML helper should properly escape dangerous characters', () => {
      const dangerous = '<script>alert("xss")</script><img src="x" onerror="alert(1)">'
      const escaped = escapeHTML(dangerous)
      
      expect(escaped).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;&lt;img src="x" onerror="alert(1)"&gt;')
      expect(escaped).not.toContain('<script>')
      expect(escaped).not.toContain('<img>')
    })
  })

  describe('Template security', () => {
    test('Templates should provide escapeHTML utility', () => {
      global.App.templates = {
        render: function(template, data) {
          if (template === 'safeProfile') {
            return `<div class="profile"><h1>${this.escape(data.name)}</h1><p>${this.escape(data.bio)}</p></div>`
          }
          return '<div>test</div>'
        },
        escape: function(str) {
          return escapeHTML(str)
        }
      }

      const maliciousData = {
        name: '<script>alert("XSS")</script>',
        bio: '<img src="x" onerror="alert(1)">'
      }
      
      const result = render('safeProfile', maliciousData)
      
      expect(result).toContain('&lt;script&gt;alert("XSS")&lt;/script&gt;')
      expect(result).toContain('&lt;img src="x" onerror="alert(1)"&gt;')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('<img>')
    })

    test('Templates can use escapeHTML for individual values', () => {
      // Example of how developers should escape user content in templates
      const userInput = '<script>alert("hack")</script>'
      const safeUserInput = escapeHTML(userInput)
      
      expect(safeUserInput).toBe('&lt;script&gt;alert("hack")&lt;/script&gt;')
      
      const template = `<div class="user-content">${safeUserInput}</div>`
      expect(template).not.toContain('<script>')
    })
  })
})