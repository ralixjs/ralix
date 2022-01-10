![Ralix.js](https://raw.githubusercontent.com/ralixjs/ralix/master/logos/cover.png)

[![](https://img.shields.io/npm/v/ralix.svg?style=flat-square)](https://www.npmjs.com/package/ralix)
[![](https://img.shields.io/npm/l/ralix?style=flat-square)](https://github.com/ralixjs/ralix/blob/master/LICENSE)

> Microframework for building and organizing Rails front-ends via Webpacker :sparkles:

Ralix provides barebones and utilities to help enhance your current Rails views. It integrates well with Turbolinks/TurboRails and Rails-UJS.

Ralix consists basically in 2 concepts, `Controllers` and `Components`:

- `Controllers`: Controllers are meant to be mounted under a route path, they are like page-specific (scoped) JavaScript.
- `Components`: Components are like widgets you will have in several pages: modals, tooltips, notifications, etc. Components can be also auto-mounted on each DOM load, you just need to pass them to the `RalixApp` instance (and implement the static method `onload`).

On the other hand, Ralix also provides some helpers and utilities to facilitate most common operations like: selectors, manipulations, events, etc. [Check it out here](#helpers).

You can read more about Ralix Design, Vision and Philosophy [here](docs/PHILOSOPHY.md).

## Installation

To install Ralix in your application, add the `ralix` [npm package](https://www.npmjs.com/package/ralix) to your JavaScript bundle.

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
│   ├── modal.js
│   └── tooltip.js
├── controllers
│   ├── app.js
│   ├── dashboard.js
│   └── users.js
├── packs
│   └── application.js
└── app.js
```

### App

The "main" application file (`app/javascript/app.js`), where you should load your modules and create a `RalixApp` instance: `new RalixApp()`. Then, you should start your Ralix application by calling: `App.start()`.

```js
// Dependencies
import Rails         from '@rails/ujs'
import Turbolinks    from 'turbolinks'
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from 'controllers/app'
import DashboardCtrl from 'controllers/dashboard'
import UsersCtrl     from 'controllers/users'

// Components with auto-start on each DOM load event (turbolinks:load, turbo:load or DOMContentLoaded)
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

Rails.start()
Turbolinks.start()
App.start()
```

In your main entrypoint file (`app/packs/application.js`), you should just import the main application:

```js
import App from '../app'
````

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

In your regular HTML views, you can call directly Ralix Helpers or the methods provided by the _current_ Ralix controller.

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

Ralix provides also a minimalistic template engine. Under the hood, it uses JavaScript Functions with Template literals.

```js
// app/javascript/app.js
import * as Templates from 'templates'

const App = new RalixApp({
  ...
  templates: Templates
  ...
})

// app/javascript/templates/index.js
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

Check a complete Rails application with Ralix here: [Ralix TodoMVC](https://github.com/ralixjs/ralix-todomvc).

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
