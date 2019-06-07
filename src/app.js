import Router from './router'

export default class App {
  constructor(config) {
    this.router = new Router(config.routes)
    this.components = config.components

    global.App = this
  }

  get ctrl() {
    return this.router.ctrl
  }

  start() {
    const event = (typeof Turbolinks !== 'undefined') ? 'turbolinks:load' : 'DOMContentLoaded'

    document.addEventListener(event, () => {
      this.router.dispatch()
      this.components.forEach(component => new(component))
    })
  }
}
