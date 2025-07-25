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

describe('Security - XSS Prevention with DOMPurify', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>'
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('insertHTML with DOMPurify sanitization', () => {
    test('insertHTML should work with legitimate HTML', () => {
      const legitimateHTML = '<div class="content"><span>Hello World</span></div>'
      
      insertHTML('#test-container', legitimateHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('<div class="content"><span>Hello World</span></div>')
      expect(container.querySelector('.content')).toBeTruthy()
    })

    test('insertHTML should sanitize malicious script tags', () => {
      const maliciousHTML = '<script>alert("XSS")</script>'
      
      insertHTML('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('')
      expect(container.innerHTML).not.toContain('<script>')
    })

    test('insertHTML should sanitize malicious event handlers', () => {
      const maliciousHTML = '<img src="x" onerror="alert(1)">'
      
      insertHTML('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('<img src="x">')
      expect(container.innerHTML).not.toContain('onerror')
    })

    test('insertHTML should work with all positions safely', () => {
      document.body.innerHTML = '<div id="target">existing</div>'
      const maliciousHTML = '<script>alert(1)</script>'
      
      insertHTML('#target', maliciousHTML, 'end')
      expect(document.getElementById('target').innerHTML).toBe('existing')
      expect(document.getElementById('target').innerHTML).not.toContain('<script>')
    })

    test('insertHTML should sanitize complex XSS attacks', () => {
      const maliciousHTML = '<div onclick="alert(1)">Click me</div><script>alert(2)</script>'
      
      insertHTML('#test-container', maliciousHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('<div>Click me</div>')
      expect(container.innerHTML).not.toContain('onclick')
      expect(container.innerHTML).not.toContain('<script>')
    })

    test('insertHTML should preserve safe elements while removing dangerous attributes', () => {
      const mixedHTML = '<p>Safe text</p><a href="javascript:alert(1)">Link</a><img src="valid.jpg" onerror="alert(1)">'
      
      insertHTML('#test-container', mixedHTML)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toContain('<p>Safe text</p>')
      expect(container.innerHTML).toContain('<a>Link</a>')
      expect(container.innerHTML).toContain('<img src="valid.jpg">')
      expect(container.innerHTML).not.toContain('javascript:')
      expect(container.innerHTML).not.toContain('onerror')
    })

    test('insertHTML should handle different position parameters', () => {
      document.body.innerHTML = '<div id="target"><span>middle</span></div>'
      
      insertHTML('#target', '<script>alert(1)</script>', 'begin')
      insertHTML('#target', '<script>alert(2)</script>', 'end')
      
      const target = document.getElementById('target')
      expect(target.innerHTML).toBe('<span>middle</span>')
      expect(target.innerHTML).not.toContain('<script>')
    })

    test('insertHTML should work with Element objects', () => {
      const element = document.createElement('div')
      element.className = 'safe-element'
      element.textContent = 'Safe content'
      
      insertHTML('#test-container', element)
      
      const container = document.getElementById('test-container')
      expect(container.innerHTML).toBe('<div class="safe-element">Safe content</div>')
    })
  })
})