# Core methods API

*Work in progress*

## Selectors

- `find(query)`

Finds one element, via `querySelector`.

- `findAll(query)`

Finds multiple elements, via `querySelectorAll`.

## Visibility

- `show(query)`

Cleans up style attribute.

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
- `data(query, attribute, value)`

## DOM

- `insertHTML(query, html, position)`
- `elem(type, attributes)`

## Templates

- `render(template, data)`

## Forms

- `serialize(query)`
- `submit(query)`

## Navigation

- `reload()`
- `visit(url)`
- `currentUrl()`
- `getParam(param)`
- `setParam(param, value, { url, update })`
- `setUrl(state, method, data)`

## Events

- `on(query, type, callback)`
- `currentElement()`
- `currentEvent()`

