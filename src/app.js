import Router from './router'

export default class App {
  constructor(config) {
    this.router = new Router(config.routes)
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
      this.components.forEach(component => new(component))

      this._allEvents().forEach((element) => {
        let attributes = Array.from(element.attributes)

        let events = attributes.forEach((attr) => {
          let match = attr.name.match(/^on(.*)/)

          if (match) {
            const [eventType, listener] = match

            const originalEvent = element[eventType]
            element[eventType] = null

            element.addEventListener(listener, (event) => {
              if (listener == 'click')
                event.preventDefault()

              this.currentElement = element
              this.currentEvent   = event

              originalEvent.call()
            })
          }
        })
      })
    })
  }

  _allEvents() {
    const _events = []

    for (let method in window) {
      if (/^on(.*)/.test(method)) {
        _events.push(`[${method}]`)
      }
    }

    return findAll(_events.join(', '))
  }
}
