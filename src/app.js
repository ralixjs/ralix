import Router    from './router'
import Events    from './events'
import Templates from './templates'
import Core      from './core'

export default class App {
  constructor(config) {
    this.router     = new Router(config.routes)
    this.events     = new Events()
    this.templates  = new Templates(config.templates)
    this.core       = new Core()

    this.rails_ujs  = config.rails_ujs || null
    this.components = config.components || []

    window.App = this
  }

  get ctrl() {
    return this.router.ctrl
  }

  start() {
    const onLoad = (typeof Turbolinks !== 'undefined') ? 'turbolinks:load' : 'DOMContentLoaded'

    document.addEventListener(onLoad, () => {
      this.core.inject()
      this.router.dispatch()
      this.events.bind()
      this.components.forEach(component => new(component))
    })
  }
}
