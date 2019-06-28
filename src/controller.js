import Rails from '@rails/ujs'

export default class Controller {
  find(query) {
    return document.querySelector(query)
  }

  findAll(query) {
    return document.querySelectorAll(query)
  }

  show(query) {
    find(query).setAttribute('style', '');
  }

  hide(query) {
    find(query).setAttribute('style', 'display: none');
  }

  redirectTo(url) {
    if (Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  submit(element) {
    if (typeof element === 'string')
      element = this.find(element)

    Rails.fire(element, 'submit')
  }
}
