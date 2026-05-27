# Helpers API

- [Selectors](#selectors)
- [Classes](#classes)
- [Attributes](#attributes)
- [DOM](#dom)
- [Templates](#templates)
- [Forms](#forms)
- [Navigation](#navigation)
- [Events](#events)
- [Ajax](#ajax)
- [Functions](#functions)
- [Object](#object)

## Selectors

### `find(query)`

Finds one element, via `querySelector`.

### `findAll(query)`

Finds multiple elements, via `querySelectorAll`.

### `findParent(queryElem, queryParent)`

Finds the element that first matches _queryParent_ among the parent elements. If no _queryParent_ is passed it will return the first parent of the element.

### `findParents(queryElem, queryParent)`

Finds multiple elements that matches _queryParent_ among the parent elements.

## Classes

### `addClass(query, classList)`

Wraps `classList.add`. The parameter _query_ could be also an array of elements. The parameter _classList_ can be a string or array of strings.

```js
addClass('#target', 'class')
addClass('#target', ['class_one', 'class_two'])
```

### `removeClass(query, classList)`

Wraps `classList.remove`. The parameter _query_ could be also an array of elements. The parameter _classList_ can be a string or array of strings.

```js
removeClass('#target', 'class')
removeClass('#target', ['class_one', 'class_two'])
```

### `toggleClass(query, classList, classValue)`

Wraps `classList.toggle`. The parameter _query_ could be also an array of elements. If the parameter _classValue_ is given, adds or deletes the class depending on this boolean.

### `hasClass(query, className)`

Wraps `classList.contains`.

## Attributes

### `attr(query, attribute, value)`

Gets/sets `query` element attribute. It also accepts an object for multiple assignment. Examples:

```js
// getter
attr('#main_menu', 'class')

// setters
attr('#main_menu', 'class', 'foo')
attr('#form input.name', { class: 'input-large', required: true })
```

### `removeAttr(query, attribute)`

Remove `query` element attribute. It also accepts an array of attributes. Examples:

```js
removeAttr('#main_menu', 'remote')

// array of attributes
removeAttr('#main_menu', ['remote', 'url'])
```

### `data(query, attribute, value)`

Similar to `attr()`, but for `dataset`. Examples:

```js
// getters
data('#form')
// { remote: false, url: '/signup' }
data('#form', 'remote')
// "false"

// setters
data('#form', 'remote', true)
data('#form', { remote: true, url: '/signup/free_trial' })
```

### `removeData(query, attribute)`

Similar to `removeAttr()`, but for `dataset`. If no attribute or attributes are passed all dataset attributes will be deleted. Examples:

```js
removeData('form', 'remote')

// all dataset attributes
removeData('form')

// array of dataset attributes
removeData('form', ['remote', 'url'])
```

### `style(query, styles)`

Gets/sets the `style` attribute of an element. It accepts a string or object for assignment. If no styles are passed, it returns the computed styles. Examples:

```js
// getter - returns computed styles
style('#main-content')

// setter with CSS string
style('#main-content', 'margin-top: 10px; margin-bottom: 5px')

// setter with object (camelCase properties are converted to kebab-case)
style('#main-content', { marginTop: '10px', marginBottom: '5px' })
```

## DOM

### `insertHTML(query, html, options = {})`

Inserts passed `html` to the `query` element, based on `options.position`. The option `position` accepts the following options: *inner* (default), *prepend*, *append*, *begin*, *end*. Examples:

```js
insertHTML('.total', `Total: <b>${totalItems}</b>`)
insertHTML('ul.items', '<li>new item</li>', { position: 'end' })
```

You can also insert *Element* instances:

```js
insertHTML('body', elem('footer'), { position: 'end' })
```

By default (`sanitize: true`), the `html` is sanitized. To skip sanitization, use `options.sanitize`:

```js
insertHTML('body', '<div onclick="alert(\'Hello\')">Click me</div>', { sanitize: false })
```

### `elem(type, attributes)`

Creates and returns an HTML element and assigns given `attributes`. Example:

```js
elem('input', { type: 'numeric', class: 'input-number' })
// <input type="numeric" class="input-number">
```

### `sanitize(data)`

XSS sanitizer. Accepts strings, arrays and objects (sanitized recursively). Example:

```js
sanitize('<img src=x onerror=alert(1)>')
// <img src="x">

sanitize({ title: '<b>ok</b>', body: '<img src=x onerror=alert(1)>' })
// { title: '<b>ok</b>', body: '<img src="x">' }
```

## Templates

### `render(template, data)`

Renders the `template` HTML, passing the given `data`. Example:

```js
render('itemCard', {
  title: item.title,
  description: item.description
})
```

By default (`sanitize: true`), the `data` passed to the template is sanitized. The template itself is not sanitized. To skip sanitization, use `options.sanitize`:

```js
render('itemCard', { title: item.title }, { sanitize: false })
```

**NOTE** The templates should be defined as JavaScript Functions and injected into the `App` object.

### `insertTemplate(query, template, data, position)`

Renders the template and inserts the generated HTML in the given _query_. Example:

```js
insertTemplate(
  '.cards-container',
  'itemCard',
  { title: item.title, description: item.description },
  'end'
)
```

The `options` are forwarded to `render` to sanitize the `data`. The rendered template is inserted via `insertHTML` with `sanitize: false`, so any HTML inside the template (e.g. `onclick`, `<script>`) is preserved. Default is `sanitize: true` (sanitizes data only):

```js
insertTemplate('.cards', 'itemCard', { title: item.title }, { sanitize: false })
```

## Forms

### `serialize(query)`

Serializes the given form. Example:

```html
<form id="form">
  <input type="text" name="x" value="1">
  <input type="text" name="y" value="2">
</form>
```

```js
serialize("#form")
// "x=1&y=2"
```

It could also be used for hash elements like the example below:

```js
serialize({ x: "1", y: "2" })
// "x=1&y=2"
```

### `submit(query)`

If `rails_ujs` is provided in `new RalixApp()`, submits the form via `Rails.fire`, otherwise uses `requestSubmit` (if available) or `submit`.

## Navigation

### `reload()`

Reloads current page.

### `visit(url)`

Navigates to the given `url`, uses `Turbo.visit` (or `Turbolinks.visit`) if possible.

### `back(fallbackUrl)`

It returns the user to the previous page (via `history.back()`). If there is no previous page or the referrer has a different hostname than the current one, it will navigate to the fallback url `visit(fallbackUrl)`.

### `currentUrl()`

Returns the current location.

### `getParam(param)`

Gets `param` value from current location. Example (assuming `?a=1&b=2`):

```js
getParam('a')
// '1'
```

If you don't pass any argument, it will return all current parameters:

```js
getParam()
// { a: '1', b: '2' }
```

### `setParam(param, value)`

Sets `value` to `param` and updates browser history (via `pushState`). If `value` is `null`, parameter is deleted. Examples:

```js
setParam('a', 1)
// 'http://localhost:1234/?a=1'
setParam('a')
// 'http://localhost:1234/'
```

You can also set multiple values at once by passing an object:

```js
setParam({ a: 1, b: 2 })
// 'http://localhost:1234/?a=1&b=2'
```

## Events

### `on(query, events, callback, options = {})`

Wraps `addEventListener`. Example:

```js
on(document, 'click', (e) => {
  addClass('.welcome-message', 'hide')
}, { once: true })
```

Accepts multiple events:

```js
on('.input-submit', 'change keyup', (e) => {
  submit('#form')
})
```

**NOTE** `on` performs `preventDefault()` on `click` events for interactive elements (links, buttons and inputs).

### `currentElement()`

Returns the element which received the current fired event.

### `currentEvent()`

Returns the current event.

## Ajax

### `ajax(path, { params, options })`

Wraps `fetch`. Adds the object `params` to `path` or `options.body` depending on `options.method`.

The object `options` can include the same options as `fetch` such as *headers*, *body*, *credentials*, *method*, etc. with the additional option *format*. The default options are *GET* for `options.method` and *include* for `options.credentials`.

Returns the response body in text. If the argument `options.format` is *json* the response body will be returned in json format.

Examples:

```js
ajax('/path/resource')
ajax('/path/resource', { params: { id: 1 }, options: { method: 'POST' }})
ajax('/path/resource', { options: { format: 'json' }})
```

### `get(path, { params, options })`

Alias for `ajax` method with `options.method` as *GET*. Example:

```js
get('/list').then((result) => {
  insertHTML('#list', result)
})
```

### `post(path, { params, options })`

Alias for `ajax` method with `options.method` as *POST*. Example:

```js
post('/comment', { params: { message: 'hello!' }}).then((content) => {
  insertHTML('#comments', `<p>${content}</p>`, { position: 'end' })
})
```

## Functions

### `debounce(fn, ms = 300)`

Returns a debounced version of the given function. The function will only be called after `ms` milliseconds have elapsed since the last invocation. Useful for delaying execution until a burst of events has stopped (e.g. user input). Example:

```js
const search = debounce((query) => {
  ajax(`/search?q=${query}`)
}, 500)

on('#search-input', 'keyup', (e) => {
  search(e.target.value)
})
```

### `throttle(fn, ms = 300)`

Returns a throttled version of the given function. The function will be called immediately on the first invocation, then subsequent calls within `ms` milliseconds will be ignored. Useful for rate-limiting event handlers (e.g. scroll, resize). Example:

```js
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY)
}, 200)

on(window, 'scroll', handleScroll)
```

## Object

### `deepMerge(target, source)`

Deep merges two objects, returning a new object. Nested objects are merged recursively. Arrays and non-object values in `source` override those in `target`. The original objects are not mutated. Example:

```js
const defaults = { ui: { theme: 'light', sidebar: true }, debug: false }
const userConfig = { ui: { theme: 'dark' }, debug: true }

deepMerge(defaults, userConfig)
// { ui: { theme: 'dark', sidebar: true }, debug: true }
```

### `pick(obj, keys)`

Returns a new object containing only the specified `keys` from `obj`. Keys that don't exist in `obj` are ignored. Example:

```js
const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' }

pick(user, ['name', 'email'])
// { name: 'Alice', email: 'alice@example.com' }
```

### `omit(obj, keys)`

Returns a new object with the specified `keys` excluded from `obj`. The original object is not mutated. Example:

```js
const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' }

omit(user, ['id', 'role'])
// { name: 'Alice', email: 'alice@example.com' }
```

### `getProperties(obj, options = {})`

Returns a `Set` of property names from the object's prototype chain. If `options.onlyFunctions` is `true`, only properties that are functions are returned. Example:

```js
class MyController {
  index() { /* ... */ }
  show() { /* ... */ }
  get name() { return 'ctrl' }
}

getProperties(new MyController())
// Set { 'index', 'show', 'name', 'constructor', ... }

getProperties(new MyController(), { onlyFunctions: true })
// Set { 'index', 'show', 'constructor' }
```
