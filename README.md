![Ralix.js](https://raw.githubusercontent.com/ralixjs/ralix/master/logos/cover.png)

[![](https://img.shields.io/npm/v/ralix.svg?style=flat-square)](https://www.npmjs.com/package/ralix)
[![](https://img.shields.io/npm/l/ralix?style=flat-square)](https://github.com/ralixjs/ralix/blob/master/LICENSE)

> Microframework for building and organizing your front-end :sparkles:

Ralix is a modest JavaScript framework that provides barebones and utilities to help enhance your server-side rendered webapps.

Ralix consists basically in 3 pieces, `Controllers`, `Components` and `Helpers`:

- `Controllers`: Controllers are meant to be mounted under a route path, they are like page-specific (scoped) JavaScript.
- `Components`: Components are like widgets you will have in several pages: modals, tooltips, notifications, etc.
- `Helpers`: Utilities to facilitate most common operations like: selectors, manipulations, events, ajax, etc. [Check it out here](#helpers).

You can read more about Ralix Design, Vision and Philosophy [here](docs/PHILOSOPHY.md).

Ralix automatically pairs really well with `Rails` and `Turbo` based applications. Check out [more information here](docs/RAILS_INTEGRATION.md).

## Installation

To install Ralix in your application, add the `ralix` [package](https://www.npmjs.com/package/ralix) to your JavaScript bundle.

Using `npm`:

```
> npm install ralix
```

Using `Yarn`:

```
> yarn add ralix
```

## Example

Structure:

```
├── components
│   ├── modal.js
│   └── tooltip.js
├── controllers
│   ├── application.js
│   ├── dashboard.js
│   └── users.js
└── app.js
```

### App

It's the entrypoint for your application (`app.js`), where you should load your modules and create a `RalixApp` instance: `new RalixApp()`. Then, you can *start* your Ralix application by calling: `App.start()`.

```js
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from 'controllers/application'
import DashboardCtrl from 'controllers/dashboard'
import UsersCtrl     from 'controllers/users'

// Components with auto-start
import Modal         from 'components/modal'
import Tooltip       from 'components/tooltip'

const App = new RalixApp({
  rails_ujs: Rails,
  routes: {
    '/dashboard': DashboardCtrl,
    '/users':     UsersCtrl,
    '/.*':        AppCtrl
  },
  components: [Modal, Tooltip]
})

App.start()
```

### Controllers

```js
export default class AppCtrl {
  back() {
    window.history.back()
  }

  toggleMenu() {
    toggleClass('#menu', 'hidden')
  }
}
```

```js
import AppCtrl from './app'

export default class UsersCtrl extends AppCtrl {
  constructor() {
    super()
  }

  back() {
    visit('/dashboard')
  }

  search() {
    hide('.search-result')
    show('.spinner')

    setTimeout(() => {
      submit('.search-form')
    }, 300)
  }
}
```

### Components

```js
export default class Modal {
  static onload() {
    findAll('.fire-modal').forEach(el => {
      on(el, 'click', () => {
        const modal = new Modal(data(el, 'url'))
        modal.show()
      })
    })
  }

  constructor(url) {
    this.url = url
  }

  show() {
    const modal      = find('#modal')
    const modalBody  = find('#modal__body')
    const modalClose = find('#modal__close')

    addClass(document.body, 'disable-scroll')
    addClass(modal, 'open')

    get(this.url).then((result) => {
      insertHTML(modalBody, result)
    })

    on(modalClose, 'click', () => {
      removeClass(document.body, 'disable-scroll')
      removeClass(modal, 'open')
      insertHTML(modalBody, 'Loading ...')
    })
  }
}
```

### Views

In your regular HTML code, now you can call directly Ralix Helpers or the methods provided by the _current_ Ralix controller.

```html
<a href="#" onclick="back()">Back</a>
<div id="menu">...</div>
...
<a href="#" onclick="toggleMenu()">Toggle Menu</a>
<a href="#" class="fire-modal" data-url="/modals/help">Help me!</a>
...
<input type="text" name="query" onkeyup="search()" />
...
<div onclick="visit('/sign-up')">...</div>
```

### Templates

Ralix provides also a minimalistic template engine, useful to DRY small snippets you need to render from your front-end. Under the hood, it uses JavaScript Functions with Template literals.

```js
import * as Templates from 'templates'

const App = new RalixApp({
  templates: Templates
})

// Define your templates
export const todoItem = ({ id, value }) => `
  <div class="item_${id}">
    <input type="checkbox">
    <label>${value}</label>
    <button onclick="destroyItem(${id})"></button>
  </div>
`

// Call it via
render('todoItem', { id: id, value: value })
```

### More examples

- Rails with Ralix, via Webpack: [Ralix TodoMVC](https://github.com/ralixjs/ralix-todomvc)
- Middleman with Ralix and Tailwind: [Ralix TodoMVC](https://github.com/ralixjs/middleman-ralix-tailwind)

## Helpers

You can find the complete API documentation [here](docs/HELPERS_API.md).

### Selectors

- find
- findAll

### Visibility

- show
- hide

### Classes

- addClass
- removeClass
- toggleClass
- hasClass

### Attributes

- attr
- data

### DOM

- insertHTML
- elem

### Templates

- render

### Forms

- serialize
- submit

### Navigation

- reload
- visit
- currentUrl
- getParam
- setParam
- setUrl

### Events

- on
- currentElement
- currentEvent

### Ajax

- ajax
- get
- post

## License

Copyright (c) Ralix Core Team. Ralix is released under the [MIT](LICENSE) License.
