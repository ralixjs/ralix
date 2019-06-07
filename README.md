# Ralix

> Microframework for building and organizing Rails front-ends :sparkles:

## Example

### App

```js
// Core
import { RalixApp } from 'ralix'

// Controllers
import AppCtrl   from 'controllers/app'
import UsersCtrl from 'controllers/users'

// Components
import Modal from 'components/modal'

const App = new RalixApp({
  routes: {
    '/users': UsersCtrl,
    '/.*':    AppCtrl
  },
  components: [
    Modal
  ]
})

App.start()
```

### Controllers

```js
import { RalixCtrl } from 'ralix'

export default class AppCtrl extends RalixCtrl {
  openModal(url, options) {
    const modal = new Modal(url, options)
    modal.show()
  }
}
```
