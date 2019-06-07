export default class Router {
  constructor(routes) {
    this.routes = routes
  }

  get path() {
    return window.location.pathname
  }

  dispatch() {
    this.findCtrl()
  }

  findCtrl() {
    if (this.ctrl) this.supressCtrl()

    for (let route in this.routes) {
      if (this.path.match(route)) {
        this.ctrl = new this.routes[route]
        this.exposeCtrl()
        break
      }
    }
  }

  exposeCtrl() {
    this.getMethods(this.ctrl).forEach(method => {
      if (typeof this.ctrl[method] === 'function')
        window[method] = this.ctrl[method].bind(this.ctrl)
    })
  }

  supressCtrl() {
    this.getMethods(this.ctrl).forEach(method => {
      delete window[method]
    })
  }

  getMethods(obj) {
    let methods = new Set()

    while (obj = Reflect.getPrototypeOf(obj)) {
      let keys = Reflect.ownKeys(obj)
      keys.forEach(k => methods.add(k))
    }

    return methods
  }
}