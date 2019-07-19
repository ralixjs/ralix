import Rails from '@rails/ujs'

export default class Controller {
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

  visit(url) {
    if (Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  submit(query) {
    Rails.fire(_element(query), 'submit')
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

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
  }
}
