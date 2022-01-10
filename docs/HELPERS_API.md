# Helpers API

## Selectors

- `find(query)`

Finds one element, via `querySelector`.

- `findAll(query)`

Finds multiple elements, via `querySelectorAll`.

## Visibility

- `show(query)`

Clean up style attribute.

- `hide(query)`

Adds `display: none` to the given element.

## Classes

- `addClass(query, classList)`

Wraps `classList.add`. The parameter _query_ could be also an array of elements.

- `removeClass(query, classList)`

Wraps `classList.remove`. The parameter _query_ could be also an array of elements.

- `toggleClass(query, classList)`

Wraps `classList.toggle`. The parameter _query_ could be also an array of elements.

- `hasClass(query, className)`

Wraps `classList.contains`.

## Attributes

- `attr(query, attribute, value)`

Gets/sets `query` element attribute. It also accepts and object for multiple assigment. Examples:

```js
// getter
> attr('#main_menu', 'class')
"menu"

// setters
> attr('#main_menu', 'class', 'foo')
> attr('#form input.name', { class: 'input-large', required: true })
```

- `data(query, attribute, value)`

Similar to `attr()`, but for `dataset`. Examples:

```js
// getters
> data('#form')
{ remote: false, url: '/signup' }
> data('#form', 'remote')
"false"

// setters
> data('#form', 'remote', true)
> data('#form', { remote: true, url: '/signup/free_trial' })
```

## DOM

- `insertHTML(query, html, position)`

Inserts passed `html` to the `query` element, based on `position`. The argument `position` accepts the following options: *inner* (default), *prepend*, *append*, *begin*, *end*. Examples:

```js
insertHTML('.total', `Total: <b>${totalItems}</b>`)
insertHTML('ul.items', '<li>new item</li>', 'end')
```

- `elem(type, attributes)`

Creates and returns an HTML element and assigns given `attributes`. Example:

```js
> elem('input', { type: 'numeric', class: 'input-number' })
<input type="numeric" class="input-number">
```

## Templates

- `render(template, data)`

Renders the `template`, passing the given `data`. Example:

```js
render('todoItem', { id: id, value: value })
```

## Forms

- `serialize(query)`

Serializes the given form. Example:

```html
<form id="form">
  <input type="text" name="x" value="1"></label>
  <input type="text" name="y" value="2"></label>
</form>

> serialize("#form")
"x=1&y=2"
```

It could also be used for hash elements like the example below:

```js
> serialize({ x: "1", y: "2" })
"x=1&y=2"
```

- `submit(query)`

If `rails_ujs` is provided in `new RalixApp()`, submits the form via `Rails.fire`, otherwise uses regular submit event.

## Navigation

- `reload()`

Reloads current page.

- `visit(url)`

Visits given `url`, uses `Turbolinks.visit` or `Turbo.visit` if possible.

- `currentUrl()`

Returns the current location.

- `getParam(param)`

Gets `param` value for the current location.

- `setParam(param, value, { url, update })`

Sets `param` value to the given location (current location by default). If `update` is *true*, browser history is updated too.

- `setUrl(state, method, data)`

Allows to update current location via browser history object. The argument `method` accepts: *push* (pushState, default) and *replace* (replaceState).

## Events

- `on(query, events, callback)`

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

- `currentElement()`

Returns the element which received the last fired event.

- `currentEvent()`

Returns the last fired event.

## Ajax

- `ajax(path, { params, options })`

Wraps `fetch`. Adds the object `params` to `path` or `options.body` depending on `options.method`.

The object `options` can include the same options as `fetch` such as *headers*, *body*, *credentials*, *method*, etc. with the additional option *format*. The default options are *GET* for `options.method` and *include* for `options.credentials`.

Returns the response body in text. If the argument `options.format` is *json* the response body will be returned in json format.

Examples:

```js
ajax('/path/resource')
ajax('/path/resource', { params: { id: 1 }, options: { method: 'POST' }})
ajax('/path/resource', { options: { format: 'json' }})
```

- `get(path, { params, options })`

Alias for `ajax` method with `options.method` as *GET*.

- `post(path, { params, options })`

Alias for `ajax` method with `options.method` as *POST*.
