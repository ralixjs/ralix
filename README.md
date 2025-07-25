![Ralix.js](https://raw.githubusercontent.com/ralixjs/ralix/master/logos/cover.jpg)

[![](https://github.com/ralixjs/ralix/actions/workflows/ci.yml/badge.svg)](https://github.com/ralixjs/ralix/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/ralix.svg)](https://www.npmjs.com/package/ralix)
[![Maintainability](https://qlty.sh/gh/ralixjs/projects/ralix/maintainability.svg)](https://qlty.sh/gh/ralixjs/projects/ralix)
[![Code Coverage](https://qlty.sh/gh/ralixjs/projects/ralix/coverage.svg)](https://qlty.sh/gh/ralixjs/projects/ralix)
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
  components: [Modal, Tooltip],
  // Optional: Security configuration for helper injection
  helpers: {
    global: true,     // Default: inject helpers globally
    whitelist: null,  // Optional: only inject specific methods
    blacklist: [],    // Optional: exclude specific methods
    prefix: ''        // Optional: prefix for global method names
  }
})

App.start()
```

The `App` object is exposed globally via the `window` object. You can access the _current_ controller via `App.ctrl`.

### Controllers

Define your _main_ controller (AppCtrl, MainCtrl, IndexCtrl, ...):

```js
// source/controllers/app.js

export default class AppCtrl {
  goBack() {
    back()
  }

  toggleMenu() {
    toggleClass('#menu', 'hidden')
  }
}
```

Inherit from your _main_ controller ([read more](docs/DESIGN.md#controllers)):

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

Example of a component with auto-mount:

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

Then, in your HTML, you just need to define a link or button like with the following attributes:

```html
<button class="fire-modal" data-url="/example-modal">Open Remote Modal</button>
```

### Views

In your regular HTML code, now you can call directly [Ralix Helpers](docs/HELPERS_API.md) or the methods provided by the _current_ Ralix controller, using regular HTML Events.

```html
<a href="#" onclick="goBack()">Back</a>
<a href="#" onclick="toggleMenu()">Toggle Menu</a>
<input type="text" name="query" onkeyup="search()">
<div onclick="visit('/sign-up')">...</div>
```

### Templates

Ralix provides also a minimalistic template engine, useful to DRY small snippets you need to render from your front-end. Under the hood, it uses JavaScript Functions with Template literals.

```js
// In your App object, inject your templates
import * as Templates from './templates'

const App = new RalixApp({
  templates: Templates
})

// Define your templates as functions
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

**🛡️ Security Note**: The `render` helper automatically sanitizes template output to prevent XSS attacks. Script tags, event handlers, and malicious URLs are automatically removed while preserving safe HTML elements.

## Security

Ralix includes built-in XSS protection and security features:

- **Template Rendering**: Automatic XSS sanitization of template output
- **HTML Insertion**: The `insertHTML` helper sanitizes content using DOMPurify
- **Configurable Helper Injection**: Control which helpers are exposed globally

For detailed security information, see [SECURITY.md](SECURITY.md).

### Security Configuration

```js
const App = new RalixApp({
  helpers: {
    global: true,                    // Enable/disable global helper injection
    whitelist: ['find', 'addClass'], // Only inject specific helpers
    blacklist: ['eval'],             // Exclude specific helpers
    prefix: 'ralix_'                 // Prefix global helper names
  }
})
```

## Ecosystem

### Starter kits

- **Full Stack Web App:** Rails with Ralix and Tailwind, via esbuild: https://github.com/ralixjs/rails-ralix-tailwind
- **Multi-page Static Site:** Middleman with Ralix and Tailwind: https://github.com/ralixjs/middleman-ralix-tailwind
- **Single Page App:** Ralix and Tailwind, with Parcel: https://github.com/ralixjs/ralix-tailwind

### Applications

- TodoMVC built with Ralix: https://github.com/ralixjs/ralix-todomvc
- Tonic Framework: https://github.com/Subgin/tonic

### Others

- Visual Studio Code plugin: https://github.com/franpb14/RalixBoost

## Development

Any kind of feedback, bug report, idea or enhancement are much appreciated.

To contribute, just fork the repo, hack on it and send a pull request. Don't forget to add tests for behaviour changes and run the test suite by:

```
> yarn test
```

If you also want to see the code coverage:

```
> yarn test --coverage
```

## License

Copyright (c) Ralix Core Team. Ralix is released under the [MIT](LICENSE) License.
