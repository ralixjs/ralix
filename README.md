# Ralix

[![](https://img.shields.io/npm/v/ralix.svg?style=flat-square)](https://www.npmjs.com/package/ralix)

> Microframework for building and organizing Rails front-ends via Webpacker :sparkles:

## Example

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
import FormErrors    from 'components/form_errors'
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
    FormErrors,
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
}
```

### Views

```html
<div>
  <a href="#" onclick="back()">Back</a>
  <div id="menu">...</div>
  ...
  <a href="#" onclick="toggleMenu()">Toggle Menu</a>
  <a href="#" onclick="openModal('/modals/help')">Help me!</a>
</div>
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

- find(query)
- findAll(query)
- show(query)
- hide(query)
- addClass(query, classList)
- removeClass(query, classList)
- toggleClass(query, classList)
- visit(url)
- submit(query)
- url()
- getParam(param)
