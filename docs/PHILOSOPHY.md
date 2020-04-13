# Ralix Design, Vision and Philosophy

Ralix is a lightweight framework with the goal to provide barebones and utilities to help enhance your current Rails (server-side) HTML, using ES6. It pairs really well with Turbolinks and the Rails UJS adapter.

Following the spirit of frameworks like [Stimulus](https://github.com/stimulusjs/stimulus), Ralix doesn't seek to take over your entire front-end logic and rendering. Instead, it's designed to enhance your HTML with just enough behavior to make it shine.

The learning curve is really flat, so you can understand the whole framework in few minutes.

Ralix has no runtime dependencies (relays only in [Webpacker](https://github.com/rails/webpacker) in your host Rails app) and all codebase is really small, around 300 LOC.

## Structure

Ralix aims to provide a basic structure to organize your JavaScript code. But gives you a lot of freedom, it just assumes a couple of directories and files, but you can create more to split your code, for example: `app/javascript/services/`, `app/javascript/validators/`, etc.

There are two basic concepts: Router (Controllers) and Components.

The Router tries to follow the idea of Rails Controllers. You should define an main controller (for example `ApplicationController.js`) and the other controllers inherit from it. This way, if you define a method in the main controller, you will have access to this method in all pages or even override this method behavior on per page basis.

The Router uses regular expressions to match the current location (url) with the defined controller. So you can have one controller to match different urls/pages:

```js
routes: {
  '/pages/[a-z0-9]': PagesCtrl,
  '/user/([0-9]+)':  UsersCtrl,
  '/.*':             AppCtrl
}
```

The Components are designed to encapsulate code for widgets you will have in several pages: modals, tooltips, forms, etc.

Components can be also auto-mounted on each DOM load, you just need to pass them to the `RalixApp` instance and Ralix will call the `onload` static method automatically. Example:

```js
export default class Tooltip {
  static onload() {
    findAll('.tooltip').forEach(el => {
      on(el, 'mouseover', () => {
        new Tooltip(data(el))
      })
    })
  }

  constructor(options = {}) {
    ...
  }
}
```

## Utilities

Utilities, aka Core methods, are helpers to help you write most common operations with a nicer and shorter API: finders, manage classes, manage elements attributes and data-attributes, submit forms, change browser history, listeners and more. You can find all helpers documentation [here](CORE_API.md).

## Logo

We use a bear, a sloth bear, inspired by **Baloo** (from **The Jungle Book**) performing the song **The Bare Necessities**.
