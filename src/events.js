export default class Events {
  constructor() {
    this.eventsRegex = /^on(\w+)/
    this.availableEvents = []

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
          const originalEvent = element[eventType]
          element[eventType] = null

          on(element, listener, originalEvent)
        }
      })
    })
  }
}
