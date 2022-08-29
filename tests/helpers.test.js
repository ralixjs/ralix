/**
 * @jest-environment jsdom
 */

import Helpers from '../src/helpers'

const helpers = new Helpers();
let element, element2;

beforeAll(() => {
  helpers.inject()
})

beforeEach(() => {
  element = document.createElement('div');
  element2 = document.createElement('div');
  document.body.appendChild(element)
  document.body.appendChild(element2)
});

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
})

describe('Visibility', () => {
  describe('show', () => {
    beforeEach(() => {
      element.style.cssText = 'display:none;';
      element.setAttribute('id', 'target');
      element.setAttribute('class', 'to-be-shown');
      element2.style.cssText = 'display:none;';
      element2.setAttribute('class', 'to-be-shown');
    });

    test('with element', () => {
      show(element);

      expect(element.style.cssText).toBe("");
    });

    test('with query', () => {
      show('#target');

      expect(element.style.cssText).toBe("");
    });

    test('with array of elements', () => {
      show([element, element2]);

      expect(element.style.cssText).toBe("");
      expect(element2.style.cssText).toBe("");
    });

    test('with query targeting multiple elements', () => {
      show('.to-be-shown');

      expect(element.style.cssText).toBe("");
      expect(element2.style.cssText).toBe("");
    });
  });

  describe('hide', () => {
    beforeEach(() => {
      element.style.cssText = 'display:block;';
      element.setAttribute('id', 'target')
      element.classList.add('to-be-hidden')
      element2.style.cssText = 'display:block;';
      element2.classList.add('to-be-hidden')
    });

    test('with element', () => {
      hide(element);

      expect(element.style.cssText).toBe('display: none;');
    });

    test('with query', () => {
      hide('#target');

      expect(element.style.cssText).toBe('display: none;');
    });

    test('with array of elements', () => {
      hide([element, element2]);

      expect(element.style.cssText).toBe('display: none;');
      expect(element2.style.cssText).toBe('display: none;');
    });

    test('with query targeting multiple elements', () => {
      hide('.to-be-hidden');

      expect(element.style.cssText).toBe('display: none;');
      expect(element2.style.cssText).toBe('display: none;');
    });
  });
});

describe('Classes', () => {
  beforeEach(() => {
    element.classList.add('extra-class');
    element2.classList.add('extra-class');
  });

  describe('addClass', () => {
    test('with element', () => {
      addClass(element, 'test');

      expect(element.classList.contains('test')).toBeTruthy();
    });

    test('with query', () => {
      addClass('.extra-class', 'test');

      expect(element.classList.contains('test')).toBeTruthy();
      expect(element2.classList.contains('test')).toBeTruthy();
    });

    test('with array of elements', () => {
      addClass([element, element2], 'test');

      expect(element.classList.contains('test')).toBeTruthy();
      expect(element2.classList.contains('test')).toBeTruthy();
    });

    test('with array of classes', () => {
      addClass(element, ['test', 'test2']);

      expect(element.classList.contains('test')).toBeTruthy();
      expect(element.classList.contains('test2')).toBeTruthy();
    });
  });

  describe('removeClass', () => {
    beforeEach(() => {
      element.classList.add('test');
      element2.classList.add('test');
    });

    test('with element', () => {
      removeClass(element, 'test');

      expect(element.classList.contains('test')).toBeFalsy();
    });

    test('with query', () => {
      removeClass('.extra-class', 'test');

      expect(element.classList.contains('test')).toBeFalsy();
      expect(element2.classList.contains('test')).toBeFalsy();
    });

    test('with array of elements', () => {
      removeClass([element, element2], 'test');

      expect(element.classList.contains('test')).toBeFalsy();
      expect(element2.classList.contains('test')).toBeFalsy();
    });

    test('with array of classes', () => {
      removeClass(element, ['test', 'test2']);

      expect(element.classList.contains('test')).toBeFalsy();
      expect(element.classList.contains('test2')).toBeFalsy();
    });
  });

  describe('toggleClass', () => {
    test('with element', () => {
      toggleClass(element, 'test');

      expect(element.classList.contains('test')).toBeTruthy();

      toggleClass(element, 'test');

      expect(element.classList.contains('test')).toBeFalsy();
    });

    test('with query', () => {
      toggleClass('.extra-class', 'test');

      expect(element.classList.contains('test')).toBeTruthy();
      expect(element2.classList.contains('test')).toBeTruthy();

      toggleClass('.extra-class', 'test');

      expect(element.classList.contains('test')).toBeFalsy();
      expect(element2.classList.contains('test')).toBeFalsy();
    });

    test('with array of elements', () => {
      toggleClass([element, element2], 'test');

      expect(element.classList.contains('test')).toBeTruthy();
      expect(element2.classList.contains('test')).toBeTruthy();

      toggleClass([element, element2], 'test');

      expect(element.classList.contains('test')).toBeFalsy();
      expect(element2.classList.contains('test')).toBeFalsy();
    });
  });

  describe('hasClass', () => {
    test('with element', () => {
      expect(hasClass(element, 'test')).toBeFalsy();
      expect(hasClass(element, 'extra-class')).toBeTruthy();
    });

    test('with query', () => {
      expect(hasClass('.extra-class', 'test')).toBeFalsy();
      expect(hasClass('.extra-class', 'extra-class')).toBeTruthy();
    });
  });
});
