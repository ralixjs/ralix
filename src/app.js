import Router    from './router'
import Events    from './events'
import Templates from './templates'
import Helpers   from './helpers'

export default class App {
  constructor(config) {
    this.router    = new Router(config.routes)
    this.events    = new Events()
    this.templates = new Templates(config.templates)
    this.helpers   = new Helpers()

    this.rails_ujs  = config.rails_ujs || null
    this.components = config.components || []

    window.App = this
  }

  get ctrl() {
    return this.router.ctrl
  }

  start() {
    const loadEvent = (typeof Turbolinks !== 'undefined') ? 'turbolinks:load' : 'DOMContentLoaded'

    document.addEventListener(loadEvent, () => {
      this.helpers.inject()
      this.router.dispatch()
      this.events.bind()
      this.components.forEach(component => {
        if (typeof component.onload === 'function')
          component.onload()
      })
    })
  }
}
