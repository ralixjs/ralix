import * as Utils from './internal_utils'

export default class Router {
  constructor(routes) {
    this.routes = routes
  }

  get path() {
    return window.location.pathname
  }

  dispatch() {
    if (this.ctrl) this._supressCtrl()

    for (let route in this.routes) {
      if (this.path.match(route)) {
        this.ctrl = new this.routes[route]
        this._exposeCtrl()
        break
      }
    }
  }

  _exposeCtrl() {
    Utils.getProperties(this.ctrl, { onlyFunctions: true }).forEach(methodName => {
      window[methodName] = this.ctrl[methodName].bind(this.ctrl)
    })
  }

  _supressCtrl() {
    Utils.getProperties(this.ctrl, { onlyFunctions: true }).forEach(methodName => {
      delete window[methodName]
    })
  }
}
