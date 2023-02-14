# Ralix Design, Vision and Philosophy

Ralix is a modest and lightweight framework with the goal to provide barebones and utilities to help enhance your current server-side rendered HTML, using ES6. It pairs really well with [Rails and Turbo](RAILS_INTEGRATION.md) applications.

Following the spirit of frameworks like [Stimulus](https://github.com/stimulusjs/stimulus) or [Alpine.js](https://github.com/alpinejs/alpine), Ralix doesn't seek to take over your entire front-end logic and rendering. Instead, it's designed to enhance your HTML with just enough behavior to make it shine. You can even easily mix Ralix with those or any framework without any fear!

The learning curve is really flat, you can understand the whole framework in few minutes.

Ralix has no runtime dependencies and all codebase is really small, around 400 LOC.

## Structure

Ralix aims to provide a basic structure to organize your JavaScript code. But gives you a lot of freedom, it just proposes a couple of directories, but you can create more to split your code, for example: `source/services/`, `source/utils/`, `source/validators/`, etc.

There are two basic structural components in a Ralix app: Controllers (_The Router_) and Components.

### Controllers

The Router tries to follow the idea of the Rails Controllers. You should define a _main_ controller (for example `AppCtrl.js`) and the other controllers should inherit from it.

```js
// source/controllers/app.js
export default class AppCtrl { }

// source/controllers/users.js
export default class UsersCtrl extends AppCtrl { }
```

Following this approach, if you define a method in the _main_ controller, you will have access to this method in all pages and eventually override its behavior on per page basis.

The Router uses regular expressions to match the current location (_url_) with the defined controller. So you can have one controller to match different urls/pages too. Example:

```js
routes: {
  '/pages/[a-z0-9]': PagesCtrl,
  '/user/([0-9]+)':  UsersCtrl,
  '/.*':             AppCtrl
}
```

**NOTE** Order matters! The first matched path will be selected as the _current_ controller, so be careful in the order you define your routes.

### Components

Components are designed to encapsulate code for widgets you will have in several pages/parts of your app: modals, tooltips, forms, etc.

Components can be also auto-mounted on each DOM load event (`turbo:load` if using `Turbo`). You just need to pass them to the `RalixApp` instance (via the `components` option) and Ralix will call the `onload` static method automatically. Example:

```js
export default class Tooltip {
  static onload() {
    on('.tooltip', 'mouseover', (event) => {
      const el = event.target

      new Tooltip(data(el))
    })
  }

  constructor(options = {}) {
    ...
  }
}
```

**NOTE** Not all components need to be auto-mounted (and define the `onload` method), you can use the directory to place other components that you will import manually only in some specific controllers.

### Helpers

Utilities, aka _Helpers_, are a set of functions to write most common operations with a nicer and shorter API: finders, manage classes, manage attributes and data-attributes, serialize and submit forms, change browser history, listeners and more. You can find the complete documentation [here](HELPERS_API.md). They are inspired by jQuery.

These provided helpers can be called in **all** the layers of your application: in the controllers, the components or directly in your views.

If you have a very simple app and you only want to use the helpers, you can do it by creating the _minimal_ Ralix app:

```js
import { RalixApp } from 'ralix'

const App = new RalixApp()
App.start()
```

## Logo and Branding

Created by [Alexander Lloyd](https://alexlloyd.info).

Check out all logo versions [here](../logos/).
