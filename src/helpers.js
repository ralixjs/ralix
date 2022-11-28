import * as Utils from './internal_utils'

export default class Helpers {
  inject() {
    Utils.getMethods(this).forEach(method => {
      if (typeof this[method] === 'function' && method != 'inject')
        window[method] = this[method].bind(this)
    })
  }

  // Selectors
  find(query) {
    if (typeof query === 'string')
      return document.querySelector(query)
    else
      return query
  }

  findAll(query) {
    if (query == null) return []

    let elements = (typeof query === 'string') ? document.querySelectorAll(query) : query

    if (Array.isArray(elements) || NodeList.prototype.isPrototypeOf(elements))
      return elements
    else
      return [elements]
  }

  findParent(queryElem, queryParent) {
    let elem = find(queryElem)
    if (queryParent === null || queryParent === undefined) return elem.parentNode

    while(elem !== document) {
      if (elem.matches(queryParent)) return elem
      elem = elem.parentNode
    }
  }

  findParents(queryElem, queryParent) {
    let elem = find(queryElem)
    const elements = []
    if (queryParent === null || queryParent === undefined) return elements

    while(elem !== document) {
      if (elem.matches(queryParent)) elements.push(elem)
      elem = elem.parentNode
    }

    return elements
  }

  // Classes
  addClass(query, classList) {
    _classModifier('add', query, classList)
  }

  removeClass(query, classList) {
    _classModifier('remove', query, classList)
  }

  toggleClass(query, classList) {
    _classModifier('toggle', query, classList)
  }

  hasClass(query, className) {
    const el = find(query)
    if (el) return el.classList.contains(className)
  }

  _classModifier(operation, query, classList) {
    const queries = Array.isArray(query) ? query : [query]

    queries.forEach(query => {
      const elements = findAll(query)
      if (elements.length == 0) return

      elements.forEach(el => {
        if (Array.isArray(classList))
          el.classList[operation](...classList)
        else
          el.classList[operation](classList)
      })
    })
  }

  // Attributes
  attr(query, attribute, value = null) {
    const el = find(query)
    if (!el) return

    if (typeof attribute === 'string')
      if (value === null)
        return el.getAttribute(attribute)
      else
        return el.setAttribute(attribute, value)
    else if (typeof attribute  === 'object')
      _setAttributes(el, attribute)
  }

  _setAttributes(elem, attributes) {
    Object.entries(attributes).forEach(entry => {
      const [key, value] = entry
      elem.setAttribute(key, value)
    })
  }

  data(query, attribute = null, value = null) {
    const el = find(query)
    if (!el) return

    if (!attribute && !value) return el.dataset

    if (typeof attribute === 'string')
      if (value === null)
        return el.dataset[attribute]
      else
        return el.dataset[attribute] = value
    else if (typeof attribute  === 'object')
      _setDataset(el, attribute)
  }

  _setDataset(elem, attributes) {
    Object.entries(attributes).forEach(entry => {
      const [key, value] = entry
      elem.dataset[key] = value
    })
  }

  removeAttr(query, attribute) {
    const el = find(query)
    if (!el) return

    if (Array.isArray(attribute)) {
      attribute.forEach((attr) => {
        el.removeAttribute(attr)
      })
    } else if (typeof attribute === "string") {
      el.removeAttribute(attribute)
    }
  }

  removeData(query, attribute = null) {
    const el = find(query)
    if (!el) return

    if (Array.isArray(attribute)) {
      attribute.forEach((attr) => {
        delete el.dataset[attr]
      })
    } else if (typeof attribute === "string") {
      delete el.dataset[attribute]
    } else if (attribute === null) {
      for( attr in el.dataset ) {
        delete el.dataset[attr]
      }
    }
  }

  // DOM
  insertHTML(query, html, position = 'inner') {
    const el = find(query)
    if (!el) return

    switch (position) {
      case 'inner':
        el.innerHTML = html
        break
      case 'prepend':
        el.insertAdjacentHTML('beforebegin', html)
        break
      case 'begin':
        el.insertAdjacentHTML('afterbegin', html)
        break
      case 'end':
        el.insertAdjacentHTML('beforeend', html)
        break
      case 'append':
        el.insertAdjacentHTML('afterend', html)
        break
    }
  }

  elem(type, attributes = null) {
    const el = document.createElement(type)
    if (attributes) _setAttributes(el, attributes)

    return el
  }

  // Templates
  render(template, data) {
    return App.templates.render(template, data)
  }

  // Forms
  serialize(query) {
    if (query instanceof Element || typeof query == 'string') {
      const form = find(query)
      if (form) return new URLSearchParams(new FormData(form)).toString()
    } else {
      return Object.keys(query)
                   .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
                   .join('&')
    }
  }

  submit(query) {
    const form = find(query)
    if (!form) return

    if (App.rails_ujs && data(form, 'remote') === 'true')
      App.rails_ujs.fire(form, 'submit')
    else if (form.requestSubmit)
      form.requestSubmit()
    else
      form.submit()
  }

  // Navigation
  visit(url) {
    if (typeof Turbo !== 'undefined')
      Turbo.visit(url)
    else if (typeof Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  back(fallbackUrl = null) {
    const referrer = document.referrer
    const isOtherHost = !referrer.includes(location.hostname)

    if (fallbackUrl && (!referrer || isOtherHost || history.length < 2))
      visit(fallbackUrl)
    else
      history.back()
  }

  reload() {
    window.location.reload()
  }

  currentUrl() {
    return window.location.href
  }

  getParam(param = null) {
    const urlParams = new URL(currentUrl()).searchParams

    if (!param) return Object.fromEntries(urlParams)

    if (urlParams.get(`${param}[]`))
      return urlParams.getAll(`${param}[]`)
    else
      return urlParams.get(param)
  }

  setParam(param, value) {
    const urlObject = new URL(currentUrl())

    if (param instanceof Object) {
      Object.entries(param).forEach(entry => {
        _setParam(urlObject, entry[0], entry[1])
      })
    } else {
      _setParam(urlObject, param, value)
    }

    history.pushState({}, '', urlObject.href)

    return urlObject.href
  }

  _setParam(urlObject, param, value) {
    if (value == null)
      urlObject.searchParams.delete(param)
    else
      urlObject.searchParams.set(param, value)
  }

  // Events
  on(query, events, callback) {
    let elements = findAll(query)
    if (elements.length == 0) return

    elements.forEach(el => {
      events.split(' ').forEach(event => _addListener(el, event, callback))
    })
  }

  currentElement() {
    return App.currentElement
  }

  currentEvent() {
    return App.currentEvent
  }

  _addListener(elem, event, callback) {
    elem.addEventListener(event, (e) => {
      if (event == 'click' && (['A', 'BUTTON'].includes(elem.tagName) || (elem.tagName == 'INPUT' && elem.type == 'submit')))
        e.preventDefault()

      App.currentElement = elem
      App.currentEvent   = e

      callback.call(this, e)

      App.currentElement = null
      App.currentEvent   = null
    })
  }

  // Ajax
  async ajax(path, { params = {}, options = {} } = {}) {
    let format = 'text'
    if ("format" in options) {
      format = options.format
      delete options.format
    }

    const defaults = { method: 'GET', credentials: 'include' }
    options = Object.assign({}, defaults, options)

    if (['POST', 'PATCH', 'PUT'].includes(options.method)) {
      if (params instanceof FormData) {
        if ("headers" in options) delete options.headers["Content-Type"]
        options = Object.assign({}, { body: params }, options)
      } else
        options = Object.assign({}, { body: JSON.stringify(params) }, options)
    }
    else if (Object.keys(params).length > 0)
      path = `${path}?${serialize(params)}`

    const response = await fetch(path, options)
    if (format.toLowerCase() === 'json')
      return response.json()
    else
      return response.text()
  }

  get(path, { params = {}, options = {} } = {}) {
    options.method = 'GET'

    return ajax(path, { params: params, options: options })
  }

  post(path, { params = {}, options = {} } = {}) {
    options.method = 'POST'

    return ajax(path, { params: params, options: options })
  }
}
