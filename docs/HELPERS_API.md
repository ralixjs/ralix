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

### `toggleClass(query, classList)`

Wraps `classList.toggle`. The parameter _query_ could be also an array of elements.

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

## DOM

### `insertHTML(query, html, position)`

Inserts passed `html` to the `query` element, based on `position`. The argument `position` accepts the following options: *inner* (default), *prepend*, *append*, *begin*, *end*. Examples:

```js
insertHTML('.total', `Total: <b>${totalItems}</b>`)
insertHTML('ul.items', '<li>new item</li>', 'end')
```

### `elem(type, attributes)`

Creates and returns an HTML element and assigns given `attributes`. Example:

```js
elem('input', { type: 'numeric', class: 'input-number' })
// <input type="numeric" class="input-number">
```

## Templates

### `render(template, data)`

Renders the `template`, passing the given `data`. Example:

```js
render('itemCard', {
  title: item.title,
  description: item.description
})
```

**NOTE** The templates should be defined as JavaScript Functions and injected into the `App` object.

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

Gets `param` value for the current location.

### `setParam(param, value, { url, update })`

Sets `param` value to the given location (current location by default). If `update` is *true*, browser history is updated too.

### `setUrl(state, method, data)`

Allows to update current location via browser history object. The argument `method` accepts: *push* (pushState, default) and *replace* (replaceState).

## Events

### `on(query, events, callback)`

Wraps `addEventListener`. Example:

```js
on(document, 'scroll', (e) => {
  addClass('body', 'scrolling')
})
```

Accepts multiple events:

```js
on('.input-submit', 'change keyup', (e) => {
  submit('#form')
})
```

**NOTE** `on` performs `preventDefault()` on `click` events for links, buttons and inputs.

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
  insertHTML('#comments', `<p>${content}</p>`, 'end')
})
```
