# Ralix Design, Vision and Philosophy

Ralix is a modest and lightweight framework with the goal to provide barebones and utilities to help enhance your current server-side rendered HTML, using ES6. It pairs really well with [Rails-Turbo](RAILS_INTEGRATION.md) applications.

Following the spirit of frameworks like [Stimulus](https://github.com/stimulusjs/stimulus) or [Alpine.js](https://github.com/alpinejs/alpine), Ralix doesn't seek to take over your entire front-end logic and rendering. Instead, it's designed to enhance your HTML with just enough behavior to make it shine.

The learning curve is really flat, you can understand the whole framework in few minutes.

Ralix has no runtime dependencies and all codebase is really small, around 400 LOC.

## Structure

Ralix aims to provide a basic structure to organize your JavaScript code. But gives you a lot of freedom, it just assumes a couple of directories, but you can create more to split your code, for example: `app/javascript/services/`, `app/javascript/validators/`, etc.

There are two basic structural components in a Ralix app: Router (Controllers) and Components.

The Router tries to follow the idea of the Rails Controllers. You should define an main controller (for example `ApplicationController.js`) and the other controllers should inherit from it. This way, if you define a method in the main controller, you will have access to this method in all pages and eventually override its behavior on per page basis.

The Router uses regular expressions to match the current location (url) with the defined controller. So you can have one controller to match different urls/pages too. Example:

```js
routes: {
  '/pages/[a-z0-9]': PagesCtrl,
  '/user/([0-9]+)':  UsersCtrl,
  '/.*':             AppCtrl
}
```

Components are designed to encapsulate code for widgets you will have in several pages/parts of your app: modals, tooltips, forms, etc.

Components can be also auto-mounted on each DOM load (or `turbo:load` if using `Turbo`). You just need to pass them to the `RalixApp` instance (via the `components` option) and Ralix will call the `onload` static method automatically. Example:

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

## Helpers

Utilities, aka _Helpers_, are a set of functions to help to write most common operations with a nicer and shorter API: finders, manage classes, manage elements attributes and data-attributes, submit forms, change browser history, listeners and more. You can find the complete documentation [here](HELPERS_API.md).

These provided helpers can be called in all the layers of your application: in the controllers, the components or directly in your views.

## Logo

Created by [Alexander Lloyd](https://www.alexanderlloyd.info).
