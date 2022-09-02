import Helpers from './helpers'

export default class Events {
  constructor() {
    this.eventsRegex = /^on(\w+)/
    this.availableEvents = []
    this.helpers = new Helpers()

    for (let property in window) {
      if (this.eventsRegex.test(property))
        this.availableEvents.push(`[${property}]`)
    }
  }

  bind() {
    findAll(this.availableEvents.join(', ')).forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        let match = attr.name.match(this.eventsRegex)

        if (match) {
          const [eventType, listener] = match

          this._addListener(element, eventType, listener)
        }
      })
    })
  }

  _addListener(element, eventType, listener) {
    const originalEvent = element[eventType]
    element[eventType] = null

    this.helpers.addListener(element, listener, originalEvent)
  }
}
