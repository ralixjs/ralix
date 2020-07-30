import Utils from './utils'

export default class Core {
  inject() {
    Utils.getMethods(this).forEach(method => {
      if (typeof this[method] === 'function' && method != 'inject')
        window[method] = this[method].bind(this)
    })
  }

  find(query) {
    return document.querySelector(query)
  }

  findAll(query) {
    return document.querySelectorAll(query)
  }

  show(query) {
    const el = _element(query)
    if (el) el.setAttribute('style', '')
  }

  hide(query) {
    const el = _element(query)
    if (el) el.setAttribute('style', 'display: none')
  }

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
    const el = _element(query)
    if (el) return el.classList.contains(className)
  }

  visit(url) {
    if (Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  reload() {
    window.location.reload()
  }

  serialize(query) {
    const form = _element(query)
    if (form) return new URLSearchParams(new FormData(form)).toString()
  }

  submit(query) {
    const form = _element(query)
    if (!form) return

    if (App.rails_ujs && data(form, 'remote') === 'true')
      App.rails_ujs.fire(form, 'submit')
    else
      form.submit()
  }

  currentUrl() {
    return window.location.href
  }

  getParam(param) {
    const urlParams = new URL(currentUrl()).searchParams

    if (urlParams.get(`${param}[]`))
      return urlParams.getAll(`${param}[]`)
    else
      return urlParams.get(param)
  }

  setParam(param, value, { url = currentUrl(), update = false } = {}) {
    const urlParams = new URL(url)
    urlParams.searchParams.set(param, value)

    if (update) setUrl(urlParams.href)

    return urlParams.href
  }

  setUrl(state, method = 'push', data = {}) {
    switch (method) {
      case "push":
        history.pushState(data, undefined, state)
        break
      case "replace":
        history.replaceState(data, undefined, state)
        break
    }
  }

  on(query, events, callback) {
    const el = _element(query)
    if (!el) return

    events.split(' ').forEach(event => el.addEventListener(event, callback))
  }

  currentElement() {
    return App.currentElement
  }

  currentEvent() {
    return App.currentEvent
  }

  insertHTML(query, html, position = 'inner') {
    const el = _element(query)
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

  elem(type, attributes) {
    const el = document.createElement(type)
    _setAttributes(el, attributes)

    return el
  }

  render(template, data) {
    return App.templates.render(template, data)
  }

  attr(query, attribute, value = null) {
    const el = _element(query)
    if (!el) return

    if (typeof attribute === 'string')
      if (!value)
        return el.getAttribute(attribute)
      else
        return el.setAttribute(attribute, value)
    else if (typeof attribute  === 'object')
      _setAttributes(el, attribute)
  }

  data(query, attribute = null, value = null) {
    const el = _element(query)
    if (!el) return

    if (!attribute && !value) return el.dataset

    if (typeof attribute === 'string')
      if (!value)
        return el.dataset[attribute]
      else
        return el.dataset[attribute] = value
    else if (typeof attribute  === 'object')
      _setDataset(el, attribute)
  }

  async ajax(path, params = {}, options = {}, dataType = 'text') {
    const defaults = { method: 'GET', credentials: 'include' }
    options = Object.assign({}, defaults, options)

    if (['POST', 'PATCH', 'PUT'].includes(options.method)) options = Object.assign({}, { body: JSON.stringify(params) }, options)
    else if (Object.keys(params).length > 0) path = `${path}?${_encodeParams(params)}`

    const response = await fetch(path, options)
    if (dataType.toLowerCase() === 'json') return response.json()
    else return response.text()
  }

  get(path, params = {}, options = {}) {
    options['method'] = 'GET'
    return ajax(path, params, options)
  }

  post(path, params = {}, options = {}) {
    options['method'] = 'POST'
    return ajax(path, params, options)
  }

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
  }

  _classModifier(operation, query, classList) {
    const queries = Array.isArray(query) ? query : [query]

    queries.forEach(query => {
      const el = _element(query)
      if (el) el.classList[operation](classList)
    })
  }

  _setAttributes(elem, attributes) {
    Object.entries(attributes).forEach(entry => {
      const [key, value] = entry
      elem.setAttribute(key, value)
    })
  }

  _setDataset(elem, attributes) {
    Object.entries(attributes).forEach(entry => {
      const [key, value] = entry
      elem.dataset[key] = value
    })
  }

  _encodeParams(params) {
    return Object.keys(params)
                 .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                 .join('&')
  }
}
