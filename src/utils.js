export default class Utils {
  static getMethods(obj) {
    let methods = new Set()

    while (obj = Reflect.getPrototypeOf(obj)) {
      let keys = Reflect.ownKeys(obj)
      keys.forEach(k => methods.add(k))
    }

    return methods
  }
}
