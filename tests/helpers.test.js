/* @jest-environment jsdom */

import Helpers from '../src/helpers'
import { jest } from '@jest/globals'

const helpers = new Helpers()
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
})

describe('DOM', () => {
  beforeEach(() => {
    element.innerHTML = 'Some content for testing'
  })

  describe('insertHTML', () => {
    test('default/inner position', () => {
      insertHTML(element, 'Diferent content')

      expect(element.innerHTML).toBe('Diferent content')

      insertHTML(element, 'More diferent content', 'inner')

      expect(element.innerHTML).toBe('More diferent content')
    })

    test('prepend position', () => {
      insertHTML(element, 'Before div', 'prepend')

      expect(document.body.innerHTML).toBe('Before div<div>Some content for testing</div><div></div>')
    })

    test('append position', () => {
      insertHTML(element, 'After div', 'append')

      expect(document.body.innerHTML).toBe('<div>Some content for testing</div>After div<div></div>')
    })

    test('begin position', () => {
      insertHTML(element, '<span>Before content</span>', 'begin')

      expect(document.body.innerHTML).toBe('<div><span>Before content</span>Some content for testing</div><div></div>')
    })

    test('end position', () => {
      insertHTML(element, '<span>After content</span>', 'end')

      expect(document.body.innerHTML).toBe('<div>Some content for testing<span>After content</span></div><div></div>')
    })

    test('render Element', () => {
      insertHTML(element, elem('p'), 'end')

      expect(document.body.innerHTML).toBe('<div>Some content for testing<p></p></div><div></div>')
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

      expect(spyElement).toHaveBeenNthCalledWith(1, 'click', expect.any(Function))
      expect(spyElement).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
      expect(spyElement2).toHaveBeenNthCalledWith(1, 'click', expect.any(Function))
      expect(spyElement2).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
    })
  })
})

describe('Ajax', () => {
  const realFetch = global.fetch

  beforeEach(() => {
    global.fetch = () => {
      return { text: jest.fn(), json: jest.fn() }
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
})
