# Ralix Vision and Philosophy

Ralix is a microframework with the goal to provide barebones and utilities to help enhance your current Rails (server-side) HTML, using ES6. It pairs really well with Turbolinks and the Rails UJS adapter.

Following the spirit of frameworks like [Stimulus](https://github.com/stimulusjs/stimulus), Ralix doesn't seek to take over your entire front-end logic and rendering. Instead, it's designed to enhance your HTML with just enough behavior to make it shine.

The learning curve is really flat, so you can understand the whole framework in few minutes.

Ralix has no runtime dependencies (relays only in [Webpacker](https://github.com/rails/webpacker) in your host Rails app) and all codebase is really small, around 300 LOC.

## Structure

Ralix aims to provide a basic structure to organize your JavaScript code. There are 2 basic concepts: Router (Controllers) and Components.

The Router tries to follow the idea of Rails Controllers. You should define an main controller (for example `ApplicationController.js`) and the other controllers inherits from it. This way, if you define a method in the main controller, you will have access to this method in all pages.

Components part is designed for widgets you will have in several pages: modals, tooltips, forms, etc. Components can be also auto-mounted on each DOM load, you just need to pass them to the `RalixApp` instance.

## Utilities

Utilities, aka Core methods, are helpers to help you write most common operations with a nicer and shorter API: finders, manage classes, manage elements attributes and data-attributes, submit forms, change browser history, events and more. You can find all helpers documentation [here](CORE_API.md).

## Logo

We use a bear, a sloth bear, inspired by Baloo (from The Jungle Book) performing the song "The Bare Necessities".
