# Core methods API

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

Wraps `classList.add`.

- `removeClass(query, classList)`

Wraps `classList.remove`.

- `toggleClass(query, classList)`

Wraps `classList.toggle`.

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

Similar to `attr()`, but for `dataset`.

## DOM

- `insertHTML(query, html, position)`

Inserts passed `html` to the `query` element, based on `position`. `position` accepts the following options: *inner* (default), *prepend*, *append*, *begin*, *end*. Examples:

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

Renders the `template`, passing the `data`. Example:

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

- `submit(query)`

If `rails_ujs` is provided, submits the form via `Rails.fire`, otherwise uses regular submit event.

## Navigation

- `reload()`

Reloads current page.

- `visit(url)`

Visits given `url`, uses `Turbolinks.visit` if possible.

- `currentUrl()`

Returns current url.

- `getParam(param)`

Gets `param` name value in current url.

- `setParam(param, value, { url, update })`

Sets `param` value to the given url (current url by default). If `update` is *true*, browser history is updated.

- `setUrl(state, method, data)`

Allows to update current url via browser history. `method` accepts: *push* (pushState, default) and *replace* (replaceState).

## Events

- `on(query, type, callback)`

Wraps `addEventListener`. Example:

```js
on(window, 'click', (e) => {
  const edit = find('input.edit')
  if (edit && !edit.contains(e.target)) saveItem(edit)
})
```

- `currentElement()`

Returns the element which received the current event.

- `currentEvent()`

Returns the current event.
