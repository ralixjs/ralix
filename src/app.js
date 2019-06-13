import Router from './router'
import Events from './events'

export default class App {
  constructor(config) {
    this.router = new Router(config.routes)
    this.events = new Events
    this.components = config.components || []

    window.App = this
  }

  get ctrl() {
    return this.router.ctrl
  }

  start() {
    const event = (typeof Turbolinks !== 'undefined') ? 'turbolinks:load' : 'DOMContentLoaded'

    document.addEventListener(event, () => {
      this.router.dispatch()
      this.events.bind()
      this.components.forEach(component => new(component))
    })
  }
}
