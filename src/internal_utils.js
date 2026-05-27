export function getMethods(obj) {
  let methods = new Set()

  while (obj = Reflect.getPrototypeOf(obj)) {
    let keys = Reflect.ownKeys(obj)
    keys.forEach(k => methods.add(k))
  }

  return methods
}

export function getProperties(obj, { onlyFunctions = false } = {}) {
  const original = obj
  let properties = new Set()

  while (obj = Reflect.getPrototypeOf(obj)) {
    let keys = Reflect.ownKeys(obj)
    keys.forEach(k => properties.add(k))
  }

  if (onlyFunctions) {
    return new Set([...properties].filter(k => typeof original[k] === 'function'))
  }

  return properties
}
