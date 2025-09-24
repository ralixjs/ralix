/* @jest-environment jsdom */

import Helpers from '../src/helpers'
import Templates from '../src/templates'
import * as ExampleTemplates from './fixtures/templates'
import { jest } from '@jest/globals'

const helpers = new Helpers()
const templates = new Templates(ExampleTemplates)

helpers.inject()

let element, element2

beforeEach(() => {
  element = document.createElement('div')
  element2 = document.createElement('div')
  document.body.appendChild(element)
  document.body.appendChild(element2)
})

afterEach(() => {
  jest.restoreAllMocks()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('Selectors', () => {
  beforeEach(() => {
    element.classList.add('test-class')
    element2.classList.add('test-class')
  })

  test('find', () => {
    expect(find('.test-class')).toEqual(element)
    expect(find('.test')).toBeNull()
  })

  test('findAll', () => {
    expect(Array.from(findAll('.test-class'))).toEqual([element, element2])
    expect(Array.from(findAll('.test'))).toEqual([])
  })

  test('findParent', () => {
    element.innerHTML = '<div><div id="parent"><div id="target"></div></div></div>'

    expect(findParent('#target', '.test-class')).toEqual(element)
    expect(findParent('#target', '.test')).toBeUndefined()
    expect(findParent('#target').id).toBe("parent")
  })

  test('findParents', () => {
    const element3 = document.createElement('div')
    element.appendChild(element3)
    element3.classList.add('test-class')
    element3.innerHTML = '<div><div id="target"></div></div>'

    expect(findParents('#target', '.test-class')).toEqual([element3, element])
    expect(findParents('#target', '.test')).toEqual([])
  })
})

describe('Classes', () => {
  beforeEach(() => {
    element.classList.add('extra-class')
    element2.classList.add('extra-class')
  })

  describe('addClass', () => {
    test('with element', () => {
      addClass(element, 'test')

      expect(element.classList.contains('test')).toBeTruthy()
    })

    test('with query', () => {
      addClass('.extra-class', 'test')

      expect(element.classList.contains('test')).toBeTruthy()
      expect(element2.classList.contains('test')).toBeTruthy()
    })

    test('with array of elements', () => {
      addClass([element, element2], 'test')

      expect(element.classList.contains('test')).toBeTruthy()
      expect(element2.classList.contains('test')).toBeTruthy()
    })

    test('with array of classes', () => {
      addClass(element, ['test', 'test2'])

      expect(element.classList.contains('test')).toBeTruthy()
      expect(element.classList.contains('test2')).toBeTruthy()
    })
  })

  describe('removeClass', () => {
    beforeEach(() => {
      element.classList.add('test')
      element2.classList.add('test')
    })

    test('with element', () => {
      removeClass(element, 'test')

      expect(element.classList.contains('test')).toBeFalsy()
    })

    test('with query', () => {
      removeClass('.extra-class', 'test')

      expect(element.classList.contains('test')).toBeFalsy()
      expect(element2.classList.contains('test')).toBeFalsy()
    })

    test('with array of elements', () => {
      removeClass([element, element2], 'test')

      expect(element.classList.contains('test')).toBeFalsy()
      expect(element2.classList.contains('test')).toBeFalsy()
    })

    test('with array of classes', () => {
      removeClass(element, ['test', 'test2'])

      expect(element.classList.contains('test')).toBeFalsy()
      expect(element.classList.contains('test2')).toBeFalsy()
    })
  })

  describe('toggleClass', () => {
    test('with element', () => {
      toggleClass(element, 'test')
      expect(element.classList.contains('test')).toBeTruthy()

      toggleClass(element, 'test')
      expect(element.classList.contains('test')).toBeFalsy()
    })

    test('with query', () => {
      toggleClass('.extra-class', 'test')

      expect(element.classList.contains('test')).toBeTruthy()
      expect(element2.classList.contains('test')).toBeTruthy()

      toggleClass('.extra-class', 'test')

      expect(element.classList.contains('test')).toBeFalsy()
      expect(element2.classList.contains('test')).toBeFalsy()
    })

    test('with array of elements', () => {
      toggleClass([element, element2], 'test')

      expect(element.classList.contains('test')).toBeTruthy()
      expect(element2.classList.contains('test')).toBeTruthy()

      toggleClass([element, element2], 'test')

      expect(element.classList.contains('test')).toBeFalsy()
      expect(element2.classList.contains('test')).toBeFalsy()
    })

    test('using a boolean to set a class', () => {
      toggleClass(element, 'test', true)
      expect(element.classList.contains('test')).toBeTruthy()

      // We repeat the test to confirm that the class is still added if classValue is true
      toggleClass(element, 'test', true)
      expect(element.classList.contains('test')).toBeTruthy()
    })

    test('using a boolean to remove a class', () => {
      toggleClass(element, 'test', true)
      expect(element.classList.contains('test')).toBeTruthy()

      toggleClass(element, 'test', false)
      expect(element.classList.contains('test')).toBeFalsy()

      // We repeat the test to confirm that the class is still removed if classValue is false
      toggleClass(element, 'test', false)
      expect(element.classList.contains('test')).toBeFalsy()
    })
  })

  describe('hasClass', () => {
    test('with element', () => {
      expect(hasClass(element, 'test')).toBeFalsy()
      expect(hasClass(element, 'extra-class')).toBeTruthy()
    })

    test('with query', () => {
      expect(hasClass('.extra-class', 'test')).toBeFalsy()
      expect(hasClass('.extra-class', 'extra-class')).toBeTruthy()
    })
  })
})

describe('Attributes', () => {
  beforeEach(() => {
    element.setAttribute('id', 'elem_1')
    element2.setAttribute('id', 'elem_2')
  })

  describe('attr', () => {
    test('getter', () => {
      expect(attr(element, 'id')).toBe('elem_1')
      expect(attr('#elem_2', 'id')).toBe('elem_2')
    })

    describe('setter', () => {
      test('with attribute', () => {
        attr(element, 'id', 'elem_3')

        expect(attr(element, 'id')).toBe('elem_3')
      })

      test('with object', () => {
        attr(element, { id: 'elem_4', disabled: true })

        expect(attr(element, 'id')).toBe('elem_4')
        expect(attr(element, 'disabled')).toBeTruthy()
      })
    })
  })

  describe('removeAttr', () => {
    beforeEach(() => {
      element.setAttribute('disabled', true)
    })

    test('with attribute', () => {
      removeAttr(element, 'disabled')

      expect(element.getAttribute('disabled')).toBeNull()
    })

    test('with array', () => {
      removeAttr(element, ['id', 'disabled'])

      expect(element.getAttribute('disabled')).toBeNull()
      expect(element.getAttribute('id')).toBeNull()
    })
  })

  describe('data', () => {
    test('getter', () => {
      element.dataset.attribute = 'test'
      element.dataset.test = 'attribute'

      expect(Object.assign({}, data(element))).toEqual({ attribute: 'test', test: 'attribute' })
      expect(data(element, 'attribute')).toBe('test')
    })

    describe('setter', () => {
      test('with attribute', () => {
        data(element, 'attribute', 'test')

        expect(element.dataset.attribute).toBe('test')
      })

      test('with object', () => {
        data(element, { attribute: 'test', test: 'attribute' })

        expect(element.dataset.attribute).toBe('test')
        expect(element.dataset.test).toBe('attribute')
      })
    })
  })

  describe('removeData', () => {
    beforeEach(() => {
      element.dataset.attr1 = 'test1'
      element.dataset.attr2 = 'test2'
      element.dataset.attr3 = 'test3'
    })

    test('with attribute', () => {
      removeData(element, 'attr1')

      expect(element.dataset.attr1).toBeUndefined()
    })

    test('with array', () => {
      removeData(element, ['attr1', 'attr2'])

      expect(element.dataset.attr1).toBeUndefined()
      expect(element.dataset.attr2).toBeUndefined()
      expect(element.dataset.attr3).toBe('test3')
    })

    test('all', () => {
      removeData(element)

      expect(element.dataset.attr1).toBeUndefined()
      expect(element.dataset.attr2).toBeUndefined()
      expect(element.dataset.attr3).toBeUndefined()
    })
  })

  describe('style', () => {
    beforeEach(() => {
      element.style.cssText = 'color: red; background: blue;'
    })

    test('getter - returns computed styles', () => {
      const computedStyles = style(element)
      expect(computedStyles).toBeInstanceOf(CSSStyleDeclaration)
      expect(computedStyles.color).toBe('red')
      expect(computedStyles.backgroundColor).toBe('blue')
    })

    test('getter with query selector', () => {
      element.id = 'test-element'
      document.body.appendChild(element)
      
      const computedStyles = style('#test-element')
      expect(computedStyles).toBeInstanceOf(CSSStyleDeclaration)
      expect(computedStyles.color).toBe('red')
      expect(computedStyles.backgroundColor).toBe('blue')
    })

    test('setter with string', () => {
      style(element, 'margin: 10px; padding: 5px;')
      expect(element.style.cssText).toBe('margin: 10px; padding: 5px;')
    })

    test('setter with object - camelCase properties', () => {
      style(element, { marginTop: '10px', marginBottom: '5px' })
      expect(element.style.cssText).toBe('margin-top: 10px; margin-bottom: 5px;')
    })

    test('setter with object - kebab-case properties', () => {
      style(element, { 'margin-left': '15px', 'padding-right': '20px' })
      expect(element.style.cssText).toBe('margin-left: 15px; padding-right: 20px;')
    })

    test('setter with object - mixed properties', () => {
      style(element, { 
        marginTop: '10px', 
        'margin-bottom': '5px',
        backgroundColor: 'yellow',
        'border-color': 'green'
      })
      expect(element.style.cssText).toBe('margin-top: 10px; margin-bottom: 5px; background-color: yellow; border-color: green;')
    })

    test('setter with query selector', () => {
      element.id = 'test-style'
      document.body.appendChild(element)
      
      style('#test-style', 'width: 100px; height: 200px;')
      expect(element.style.cssText).toBe('width: 100px; height: 200px;')
    })

    test('returns undefined for non-existent element', () => {
      expect(style('.non-existent')).toBeUndefined()
    })
  })
})

describe('DOM', () => {
  beforeEach(() => {
    element.innerHTML = 'Some content for testing'
  })

  describe('insertHTML', () => {
    test('default/inner position', () => {
      insertHTML(element, 'Diferent content')

      expect(element.innerHTML).toBe('Diferent content')

      insertHTML(element, 'More diferent content', { position: 'inner' })

      expect(element.innerHTML).toBe('More diferent content')
    })

    test('prepend position', () => {
      insertHTML(element, 'Before div', { position: 'prepend' })

      expect(document.body.innerHTML).toBe('Before div<div>Some content for testing</div><div></div>')
    })

    test('append position', () => {
      insertHTML(element, 'After div', { position: 'append' })

      expect(document.body.innerHTML).toBe('<div>Some content for testing</div>After div<div></div>')
    })

    test('begin position', () => {
      insertHTML(element, '<span>Before content</span>', { position: 'begin' })

      expect(document.body.innerHTML).toBe('<div><span>Before content</span>Some content for testing</div><div></div>')
    })

    test('end position', () => {
      insertHTML(element, '<span>After content</span>', { position: 'end' })

      expect(document.body.innerHTML).toBe('<div>Some content for testing<span>After content</span></div><div></div>')
    })

    test('old options approach should also work', () => {
      insertHTML(element, '<span>After content</span>', 'end')

      expect(document.body.innerHTML).toBe('<div>Some content for testing<span>After content</span></div><div></div>')
    })

    test('render Element', () => {
      insertHTML(element, elem('p'), { position: 'end' })

      expect(document.body.innerHTML).toBe('<div>Some content for testing<p></p></div><div></div>')
    })

    test('should sanitize malicious script tags', () => {
      const maliciousHTML = '<script>alert("XSS")</script>'
      
      insertHTML(element, maliciousHTML)
      
      expect(element.innerHTML).toBe('')
      expect(element.innerHTML).not.toContain('<script>')
    })

    test('should not sanitize malicious script tags if sanitize is false', () => {
      const maliciousHTML = '<script>alert("XSS")</script>'

      insertHTML(element, maliciousHTML, { sanitize: false })

      expect(element.innerHTML).toBe(maliciousHTML)
    })

    test('should sanitize malicious event handlers', () => {
      const maliciousHTML = '<img src="x" onerror="alert(1)">'
      
      insertHTML(element, maliciousHTML)
      
      expect(element.innerHTML).toBe('<img src="x">')
      expect(element.innerHTML).not.toContain('onerror')
    })

    test('should sanitize complex XSS attacks', () => {
      const maliciousHTML = '<div onclick="alert(1)">Click me</div><script>alert(2)</script>'
      
      insertHTML(element, maliciousHTML)
      
      expect(element.innerHTML).toBe('<div>Click me</div>')
      expect(element.innerHTML).not.toContain('onclick')
      expect(element.innerHTML).not.toContain('<script>')
    })

    test('should preserve safe elements while removing dangerous attributes', () => {
      const mixedHTML = '<p>Safe text</p><a href="javascript:alert(1)">Link</a><img src="valid.jpg" onerror="alert(1)">'
      
      insertHTML(element, mixedHTML)
      
      expect(element.innerHTML).toContain('<p>Safe text</p>')
      expect(element.innerHTML).toContain('<a>Link</a>')
      expect(element.innerHTML).toContain('<img src="valid.jpg">')
      expect(element.innerHTML).not.toContain('javascript:')
      expect(element.innerHTML).not.toContain('onerror')
    })
  })

  describe('elem', () => {
    test('with attributes', () => {
      element = elem('span', { id: 'new_span', class: 'test' })

      expect(element.tagName).toBe('SPAN')
      expect(element.getAttribute('id')).toBe('new_span')
      expect(element.getAttribute('class')).toBe('test')
    })

    test('without attributes', () => {
      element = elem('div')

      expect(element.tagName).toBe('DIV')
    })
  })
})

describe('sanitize', () => {
  describe('XSS Protection', () => {
    test('should sanitize javascript: URLs in attributes', () => {
      const maliciousData = {
        src: 'javascript:alert("XSS")',
        alt: 'Test image'
      }
      const maliciousHTML = ExampleTemplates.attributeInjection(maliciousData)

      const result = sanitize(maliciousHTML)

      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('alert("XSS")')
      expect(result).toContain('alt="Test image"')
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

      const result = sanitize(data)

      // Scripts should be removed from variables
      expect(result.user.name).not.toContain('<script>')
      expect(result.items[0]).not.toContain('<script>')
      expect(result.user.name).not.toContain('alert(')
      expect(result.user.profile.bio).not.toContain('alert(')
      expect(result.items[0]).not.toContain('alert(')
      expect(result.items[1]).not.toContain('alert(')
      expect(result.items[1]).not.toContain('javascript:')

      // Safe content should be preserved
      expect(result.user.name).toContain('John')
      expect(result.user.profile.bio).toContain('Developer')
      expect(result.items[2]).toContain('Safe item')
      expect(result.user.profile.bio).toContain('<img src="x">')
    })

    test('should handle primitive values in data', () => {
      const data = {
        message: '<script>alert("XSS")</script>Hello',
        count: 42,
        isActive: true,
        nullValue: null,
        undefinedValue: undefined
      }

      const result = sanitize(data)

      expect(result.message).not.toContain('<script>')
      expect(result.message).toContain('Hello')
      expect(result.count).toBe(42)
      expect(result.isActive).toBeTruthy()
      expect(result.nullValue).toBeNull()
      expect(result.undefinedValue).toBeUndefined()
    })
  })
})

describe('Templates', () => {
  describe('insertTemplate', () => {
    let container

    beforeEach(() => {
      window.App = { templates }
      container = document.createElement('div')
      container.className = 'test-container'
      document.body.appendChild(container)
    })

    test('inserts template with default position (inner)', () => {
      container.innerHTML = '<p>original content</p>'

      insertTemplate('.test-container', 'template1', 'inserted content')

      expect(container.innerHTML).toBe('<div>inserted content</div>')
    })

    test('inserts template with different positions', () => {
      container.innerHTML = '<p>original</p>'

      insertTemplate('.test-container', 'template1', 'end content', { position: 'end' })
      expect(container.innerHTML).toBe('<p>original</p><div>end content</div>')
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
  })
})

describe('Forms', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<form id="form"><input type="number" name="first" value="1"><input type="text" name="second" value="2"></form>'
  })

  describe('serialize', () => {
    test('with form', () => {
      expect(serialize('#form')).toBe('first=1&second=2')
      expect(serialize(find('#form'))).toBe('first=1&second=2')
    })

    test('with object', () => {
      expect(serialize({ first: '1', second: '2' })).toBe('first=1&second=2')
    })
  })

  describe('submit', () => {
    beforeEach(() => {
      // Mock requestSubmit
      HTMLFormElement.prototype.requestSubmit = jest.fn()
    })

    test('without rails_ujs', () => {
      // Mock App
      window.App = {
        rails_ujs: false
      }
      const form = document.body.querySelector('form')
      const spy = jest.spyOn(form, 'requestSubmit')

      submit('#form')

      expect(spy).toHaveBeenCalledTimes(1)
    })

    test('with rails_ujs & data-remote', () => {
      // Mock App & rails_ujs
      window.App = {
        rails_ujs: {
          fire: jest.fn()
        }
      }
      document.body.innerHTML = '<form data-remote="true"><input type="number" name="first" value="1"></form>'
      const form = document.body.querySelector('form')
      const spy = jest.spyOn(form, 'requestSubmit')

      submit('#form')

      expect(spy).toHaveBeenCalledTimes(0)
    })
  })
})

describe('Navigation', () => {
  const location = window

  beforeAll(() => {
    delete window.location
    window.location = {
      reload: jest.fn(),
      href: ''
    }
  })

  afterAll(() => {
    window.location = location
  })

  test('reload', () => {
    reload()

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  test('visit', () => {
    visit('url')

    expect(window.location.href).toBe('url')
  })

  test('currentUrl', () => {
    window.location.href = 'test/url'

    expect(currentUrl()).toBe('test/url')
  })

  describe('getParam', () => {
    test('single param', () => {
      window.location.href = 'http://example.com/?test=1'

      expect(getParam('test')).toBe('1')
    })

    test('array of params', () => {
      window.location.href = 'http://example.com/?test[]=1&test[]=2'

      expect(getParam('test')).toEqual(['1', '2'])
    })

    test('no param, returns all parameters', () => {
      window.location.href = 'http://example.com/?a=1&b=2'

      expect(getParam()).toEqual({ a: '1', b: '2' })
    })
  })

  describe('setParam', () => {
    let historyPush, spy

    beforeEach(() => {
      historyPush = history.pushState
      history.pushState = jest.fn()
      window.location.href = 'http://example.com/'
      spy = jest.spyOn(history, 'pushState')
    })

    afterEach(() => {
      history.pushState = historyPush
    })

    test('set value', () => {
      expect(setParam('a', '1')).toBe('http://example.com/?a=1')
      expect(spy).toHaveBeenCalledWith({}, '', 'http://example.com/?a=1')
    })

    test('set multiple values', () => {
      expect(setParam({ a: 1, b: 2 })).toBe('http://example.com/?a=1&b=2')
      expect(spy).toHaveBeenCalledWith({}, '', 'http://example.com/?a=1&b=2')
    })

    test('remove value', () => {
      expect(setParam('a')).toBe('http://example.com/')
      expect(spy).toHaveBeenCalledWith({}, '', 'http://example.com/')
    })
  })

  describe('back', () => {
    beforeEach(() => {
      window.location.href = 'http://example.com/'
      window.location.hostname = 'example.com'
    })

    test('without history length', () => {
      back('/back_fallback')

      expect(window.location.href).toBe('/back_fallback')
    })

    test('with history length', () => {
      jest.spyOn(history, 'length', 'get').mockReturnValue(3)
      jest.spyOn(document, 'referrer', 'get').mockReturnValue('http://example.com/test')
      const spyBack = jest.spyOn(history, 'back')

      back('/back_fallback')

      expect(spyBack).toHaveBeenCalledTimes(1)
    })

    test('with a different hostname', () => {
      jest.spyOn(history, 'length', 'get').mockReturnValue(3)
      jest.spyOn(document, 'referrer', 'get').mockReturnValue('http://other.com/')

      back('/back_fallback')

      expect(window.location.href).toBe('/back_fallback')
    })
  })
})

describe('Events', () => {
  describe('on', () => {
    test('with multiple targets & multiple events', () => {
      const callback = jest.fn()
      element.addEventListener = jest.fn()
      element2.addEventListener = jest.fn()
      const spyElement = jest.spyOn(element, 'addEventListener')
      const spyElement2 = jest.spyOn(element2, 'addEventListener')

      on('div', 'click blur', callback)

      expect(spyElement).toHaveBeenNthCalledWith(1, 'click', expect.any(Function), {})
      expect(spyElement).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function), {})
      expect(spyElement2).toHaveBeenNthCalledWith(1, 'click', expect.any(Function), {})
      expect(spyElement2).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function), {})
    })

    test('with "once" option', () => {
      const callback = jest.fn()
      const spyElement = jest.spyOn(element, 'addEventListener')

      on(element, 'click', callback, { once: true })

      element.dispatchEvent(new Event('click'))
      element.dispatchEvent(new Event('click'))

      expect(spyElement).toHaveBeenCalledTimes(1)
      expect(spyElement).toHaveBeenCalledWith('click', expect.any(Function), { once: true })
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Ajax', () => {
  const realFetch = global.fetch

  beforeEach(() => {
    global.fetch = () => {
      return { text: jest.fn(), json: jest.fn(), status: 200, ok: true, statusText: 'OK' }
    }
  })

  afterEach(() => {
    global.fetch = realFetch
  })

  test('get', () => {
    const spy = jest.spyOn(global, 'fetch')

    ajax('http://example.com/', { params: { foo: 'test' } })

    expect(spy).toHaveBeenCalledWith('http://example.com/?foo=test', { method: 'GET', credentials: 'include' })
  })

  describe('post', () => {
    test('with JSON', () => {
      const spy = jest.spyOn(global, 'fetch')

      ajax('http://example.com/', { params: { foo: 'test' }, options: { method: 'POST' } })

      expect(spy).toHaveBeenCalledWith('http://example.com/', { method: 'POST', credentials: 'include', body: JSON.stringify({ foo: 'test' }) })
    })

    test('with FormData', () => {
      const spy = jest.spyOn(global, 'fetch')
      const form = new FormData()
      form.append('foo', 'test')

      ajax('http://example.com/', { params: form, options: { method: 'POST' } })

      expect(spy).toHaveBeenCalledWith('http://example.com/', { method: 'POST', credentials: 'include', body: form })
    })

    test('with FormData deletes Content-Type header', () => {
      const spy = jest.spyOn(global, 'fetch')
      const form = new FormData()
      form.append('foo', 'test')

      ajax('http://example.com/', { params: form, options: { method: 'POST', headers: { 'Content-Type': 'text/plain' } } })

      expect(spy).toHaveBeenCalledWith('http://example.com/', { method: 'POST', credentials: 'include', body: form, headers: {} })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('rejects with error when fetch throws', async () => {
      const error = new Error('Network error')
      global.fetch = jest.fn().mockRejectedValue(error)

      await expect(ajax('http://example.com/')).rejects.toThrow('Network error')
    })

    test('rejects with error when response is not ok (status 404)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: jest.fn().mockResolvedValue('Not Found'),
        json: jest.fn().mockResolvedValue({ message: 'Not Found' })
      })

      await expect(ajax('http://example.com/')).rejects.toThrow(/HTTP error! Status: 404.*Not Found/)
    })

    test('rejects with error when response is not ok (status 500)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: jest.fn().mockResolvedValue('Internal Server Error'),
        json: async () => { throw new Error('Not JSON') }
      })

      await expect(ajax('http://example.com/')).rejects.toThrow(/HTTP error! Status: 500.*Internal Server Error/)
    })

    test('error is catchable via .catch()', async () => {
      const error = new Error('Network error')
      global.fetch = jest.fn().mockRejectedValue(error)

      let caught = false
      await ajax('http://example.com/').catch(e => {
        caught = true
        expect(e).toBe(error)
      })
      expect(caught).toBe(true)
    })
  })
})
