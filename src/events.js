export default class Events {
  constructor() {
    this.availableEvents = []

    for (let property in window) {
      if (/^on(.*)/.test(property))
        this.availableEvents.push(`[${property}]`)
    }
  }

  bind() {
    findAll(this.availableEvents.join(', ')).forEach((element) => {
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

            App.currentElement = element
            App.currentEvent   = event

            originalEvent.call()
          })
        }
      })
    })
  }
}
