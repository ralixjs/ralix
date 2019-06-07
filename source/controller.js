import Rails from '@rails/ujs'

export default class Controller {
  find(query) {
    return document.querySelector(query)
  }

  findAll(query) {
    return document.querySelectorAll(query)
  }

  redirectTo(url) {
    Turbolinks.visit(url)
  }

  submit(element) {
    if (typeof element === 'string')
      element = this.find(element)

    Rails.fire(element, 'submit')
  }
}