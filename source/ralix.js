import Router from 'lib/router'

export default class Ralix {
  constructor(config) {
    this.router = new Router(config.routes)
    this.components = config.components

    global.App = this
  }

  get ctrl() {
    return this.router.ctrl
  }

  start() {
    document.addEventListener('turbolinks:load', () => {
      this.router.dispatch()
      this.components.forEach(component => new(component))
    })
  }
}