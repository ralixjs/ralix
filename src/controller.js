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

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
  }
}
