# Ralix + Rails

Ralix pairs really well with Turbo-based (_Turbo_ or _Turbolinks_) Rails applications.

It also integrates with the _RailsUJS_ adapter. In that case, you need to pass the instance via the `rails_ujs` option in the constructor.

Your main entrypoint (`app/javascript/application.js`) should look like something similar to:

```js
// Dependencies
import Rails        from '@rails/ujs'
import Turbolinks   from 'turbolinks'
import { RalixApp } from 'ralix'

// Controllers
import AppCtrl      from './controllers/app'
import UsersCtrl    from './controllers/users'
import ProductsCtrl from './controllers/products'

// Components
import Modal        from './components/modal'
import Tooltip      from './components/tooltip'

const App = new RalixApp({
  rails_ujs: Rails,
  routes: {
    '/users':    UsersCtrl,
    '/products': ProductsCtrl,
    '/.*':       AppCtrl
  },
  components: [Modal, Tooltip]
})

Rails.start()
Turbolinks.start()
App.start()
```

You can check out a full Rails example with Ralix, in the [Ralix TodoMVC](https://github.com/ralixjs/ralix-todomvc) repository.
