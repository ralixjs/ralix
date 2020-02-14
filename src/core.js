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
    const el = _element(query)
    if (el) el.classList.add(classList)
  }

  removeClass(query, classList) {
    const el = _element(query)
    if (el) el.classList.remove(classList)
  }

  toggleClass(query, classList) {
    const el = _element(query)
    if (el) el.classList.toggle(classList)
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

  submit(query) {
    const form = _element(query)
    if (!form) return

    if (App.rails_ujs)
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

  attr(query, attribute, value) {
    const el = _element(query)
    if (!el) return

    if (value == undefined) {
      return el.getAttribute(attribute)
    } else {
      el.setAttribute(attribute, value)
      return value
    }
  }

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
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
}
