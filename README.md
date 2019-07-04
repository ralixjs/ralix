# Ralix

[![](https://img.shields.io/npm/v/ralix.svg?style=flat-square)](https://www.npmjs.com/package/ralix)

> Microframework for building and organizing Rails front-ends :sparkles:

## Example

### App

```js
// Core
import { RalixApp } from 'ralix'

// Controllers
import AppCtrl   from 'controllers/app'
import UsersCtrl from 'controllers/users'

// Components with auto-start on each DOM load event (turbolinks:load or DOMContentLoaded)
import FlashMessages from 'components/flash_messages'

const App = new RalixApp({
  routes: {
    '/users': UsersCtrl,
    '/.*':    AppCtrl
  },
  components: [
    FlashMessages
  ]
})

App.start()
```

### Controller

```js
import { RalixCtrl } from 'ralix'
import Modal from 'components/modal'

export default class AppCtrl extends RalixCtrl {
  openModal(url, options) {
    const modal = new Modal(url, options)
    modal.show()
  }
}
```

### Component

```js
export default class FlashMessages {
  constructor() {
    const flashMessages = findAll('.js-close-alert')

    flashMessages.forEach(message => {
      message.addEventListener('click', () => {
        message.parentElement.classList.add('hidden')
      })
    })
  }
}
```

## Core methods

- find
- findAll
- show
- hide
- addClass
- removeClass
- visit
- submit
