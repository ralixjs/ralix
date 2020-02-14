![Ralix.js](https://raw.githubusercontent.com/ralixjs/ralix/master/logos/cover.png)

[![](https://img.shields.io/npm/v/ralix.svg?style=flat-square)](https://www.npmjs.com/package/ralix)
[![Maintainability](https://api.codeclimate.com/v1/badges/8e91bd9dc7263d19291c/maintainability)](https://codeclimate.com/github/ralixjs/ralix/maintainability)

> Microframework for building and organizing Rails front-ends via Webpacker :sparkles:

Ralix provides barebones and utilities to help enhance your current Rails views. It integrates well with Turbolinks and Rails-UJS.

Ralix consists basically in 2 concepts, `Controllers` and `Components`:

- `Controllers`: Controllers are meant to be mounted under a route path, they are like page-specific (scoped) JavaScript.

- `Components`: Components are like widgets you will have in several pages: modals, tooltips, notifications, etc. Components can be also auto-mounted on each DOM load, you just need to pass them to the `RalixApp` instance.

On the other hand, Ralix also provides some helpers and utilities to facilitate most common operations like: selectors, manipulations, events, etc. [Check it out here](#core-methods).

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
│   ├── geolocation.js
│   ├── flash_messages.js
│   ├── forms.js
├── controllers
│   ├── users.js
│   ├── dashboard.js
│   ├── bookings.js
│   └── app.js
├── packs
│   └── application.js
└── app.js
```

### App

```js
// Dependencies
import Rails         from '@rails/ujs'
import Turbolinks    from 'turbolinks'
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from 'controllers/app'
import DashboardCtrl from 'controllers/dashboard'
import BookingsCtrl  from 'controllers/bookings'
import UsersCtrl     from 'controllers/users'

// Components with auto-start on each DOM load event (turbolinks:load or DOMContentLoaded)
import Forms         from 'components/forms'
import FlashMessages from 'components/flash_messages'

const App = new RalixApp({
  rails_ujs: Rails,
  routes: {
    '/dashboard': DashboardCtrl,
    '/bookings':  BookingsCtrl,
    '/users':     UsersCtrl,
    '/.*':        AppCtrl
  },
  components: [
    Forms,
    FlashMessages
  ]
})

Rails.start()
Turbolinks.start()
App.start()
```

### Controllers

```js
import Modal from 'components/modal'

export default class AppCtrl {
  back() {
    window.history.back()
  }

  toggleMenu() {
    toggleClass('#menu', 'hidden')
  }

  openModal(url, options) {
    const modal = new Modal(url, options)
    modal.show()
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

### Views

```html
<a href="#" onclick="back()">Back</a>
<div id="menu">...</div>
...
<a href="#" onclick="toggleMenu()">Toggle Menu</a>
<a href="#" onclick="openModal('/modals/help')">Help me!</a>
...
<input type="text" name="query" onkeyup="search()" />
...
<div onclick="visit('/sign-up')">...</div>
```

### Components

```js
export default class FlashMessages {
  constructor() {
    const flashMessages = findAll('.js-close-alert')

    flashMessages.forEach(message => {
      message.addEventListener('click', () => {
        addClass(message.parentElement, 'hidden')
      })
    })
  }
}
```

## Core methods

### Selectors

- find(query)
- findAll(query)

### Visibility

- show(query)
- hide(query)

### Classes

- addClass(query, classList)
- removeClass(query, classList)
- toggleClass(query, classList)

### DOM

- insertHTML(query, html, position)

### Forms

- submit(query)

### Navigation

- reload()
- visit(url)
- currentUrl()
- getParam(param)
- setParam(param, value, url)

### Events

- currentElement()
- currentEvent()

### Attributes

- attr(query, attribute)
- attr(query, attribute, value)
