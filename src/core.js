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
    _element(query).setAttribute('style', '')
  }

  hide(query) {
    _element(query).setAttribute('style', 'display: none')
  }

  addClass(query, classList) {
    _element(query).classList.add(classList)
  }

  removeClass(query, classList) {
    _element(query).classList.remove(classList)
  }

  toggleClass(query, classList) {
    _element(query).classList.toggle(classList)
  }

  visit(url) {
    if (Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  submit(query) {
    const form = _element(query)

    if (App.rails_ujs)
      App.rails_ujs.fire(form, 'submit')
    else
      form.submit()
  }

  url() {
    return window.location.href
  }

  getParam(param) {
    const urlParams = new URL(url()).searchParams

    if (urlParams.get(`${param}[]`))
      return urlParams.getAll(`${param}[]`)
    else
      return urlParams.get(param)
  }

  currentElement() {
    return App.currentElement
  }

  currentEvent() {
    return App.currentEvent
  }

  insertHTML(query, html, position = 'inner') {
    const el = _element(query)

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

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
  }
}
