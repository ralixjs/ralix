# Changelog

All notable changes to this project will be documented in this file.

## Next

- Refactor `getParams` and `setParams` helpers (#75)
- Remove `setUrl` helper (#75)

## [1.2.0]

- New `back` helper (#72, #73)
- Allow to create elements without attributes: `elem('p')`

## [1.1.1]

- Fix automatic `preventDefault()` conditions (#68)

## [1.1.0]

- Add `findParent` and `findParents` helpers (#66)
- Automatic `preventDefault()` only for submit inputs (#67)

## [1.0.1]

- `on` performs `preventDefault()` on click events only for interactive elements (#65)

## [1.0.0]

- Allow `ajax` functions to receive params as `formData`
- Support handling array of classes in classes helpers
- Remove `show` and `hide` helpers
- Set `currentElem` and `currentEvent` when using the `on` helper
- Support `requestSubmit` on `submit` helper
- Add tests and CI

## [0.10.0]

- New Logo, Branding and Starter Kits
- New helpers: `removeAttr` and `removeData`
- Documentation revamp

## [0.9.0]

- Add Turbo support

## [0.8.1]

- `findAll` returns an array for single elements

## [0.8.0]

- Add Ajax helpers: `ajax`, `get` and `post`
- `serialize` works with objects too
- Use `findAll` in `show`, `hide` and `on`

[1.2.0]: https://github.com/ralixjs/ralix/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/ralixjs/ralix/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/ralixjs/ralix/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ralixjs/ralix/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ralixjs/ralix/compare/v0.10.0...v1.0.0
[0.10.0]: https://github.com/ralixjs/ralix/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/ralixjs/ralix/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/ralixjs/ralix/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/ralixjs/ralix/compare/v0.7.4...v0.8.0
