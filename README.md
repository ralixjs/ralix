![Ralix.js](https://raw.githubusercontent.com/ralixjs/ralix/master/logos/cover.jpg)

[![](https://github.com/ralixjs/ralix/actions/workflows/ci.yml/badge.svg)](https://github.com/ralixjs/ralix/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/ralix.svg)](https://www.npmjs.com/package/ralix)
[![](https://img.shields.io/npm/l/ralix)](https://github.com/ralixjs/ralix/blob/master/LICENSE)

> Microframework for building and organizing your front-end :sparkles:

Ralix is a modest JavaScript framework that provides barebones and utilities to help enhance your server-side rendered webapps.

Ralix consists basically in 3 pieces:

- `Controllers`: Controllers are meant to be mounted under a route path, they are like page-specific (scoped) JavaScript.
- `Components`: Components are like widgets you will have in several pages: modals, tooltips, notifications, etc.
- `Helpers`: Utilities to facilitate most common operations like: selectors, manipulations, events, ajax, etc. [Check it out here](docs/HELPERS_API.md).

You can read more about Ralix Design, Vision and Philosophy [here](docs/DESIGN.md).

Ralix pairs well with `Rails` and `Turbo` based applications. Check out [more information here](docs/RAILS_INTEGRATION.md).

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

## Example application

Structure:

```
source/
├── components/
│   ├── modal.js
│   └── tooltip.js
├── controllers/
│   ├── application.js
│   ├── dashboard.js
│   └── users.js
└── app.js
```

### App object

It's the entrypoint for your application (`source/app.js`), where you should load your modules and create a `RalixApp` instance: `new RalixApp()`. Then, you can _start_ your Ralix application by calling: `App.start()`. Don't forget to include your entrypoint in your layout.

```js
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from './controllers/application'
import DashboardCtrl from './controllers/dashboard'
import UsersCtrl     from './controllers/users'

// Components with auto-start
import Modal         from './components/modal'
import Tooltip       from './components/tooltip'

const App = new RalixApp({
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
// source/controllers/app.js

export default class AppCtrl {
  goBack() {
    window.history.back()
  }

  toggleMenu() {
    toggleClass('#menu', 'hidden')
  }
}
```

```js
// source/controllers/users.js

import AppCtrl from './application'

export default class UsersCtrl extends AppCtrl {
  constructor() {
    super()
  }

  goBack() {
    visit('/dashboard')
  }

  search() {
    addClass('.search-result', 'hidden')
    removeClass('.spinner', 'hidden')

    setTimeout(() => {
      submit('.search-form')
    }, 300)
  }
}
```

### Components

```js
// source/components/modal.js

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
<a href="#" onclick="goBack()">Back</a>
<a href="#" onclick="toggleMenu()">Toggle Menu</a>
<input type="text" name="query" onkeyup="search()">
<div onclick="visit('/sign-up')">...</div>
```

### Templates

Ralix provides also a minimalistic template engine, useful to DRY small snippets you need to render from your front-end. Under the hood, it uses JavaScript Functions with Template literals.

```js
import * as Templates from 'templates'

const App = new RalixApp({
  templates: Templates
})

export const itemCard = ({ title, description }) => `
  <div class="item-card">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
`

// Call it via
render('itemCard', {
  title: item.title,
  description: item.description
})
```

## Starter Kits and example apps

- Rails with Ralix, via Webpack: https://github.com/ralixjs/ralix-todomvc
- Middleman with Ralix and Tailwind: https://github.com/ralixjs/middleman-ralix-tailwind
- Ralix and Tailwind, with Parcel: https://github.com/ralixjs/ralix-tailwind

## Development

Any kind of feedback, bug report, idea or enhancement are much appreciated.

To contribute, just fork the repo, hack on it and send a pull request. Don't forget to add tests for behaviour changes and run the test suite by:

```
> yarn test
```

If you also want to see the code coverage:

```
> yarn test --collectCoverage
```

## License

Copyright (c) Ralix Core Team. Ralix is released under the [MIT](LICENSE) License.
