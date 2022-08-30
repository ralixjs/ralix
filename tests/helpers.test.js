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

describe('Attributes', () => {
  beforeEach(() => {
    element.setAttribute('id', 'elem_1');
    element2.setAttribute('id', 'elem_2');
  });

  describe('attr', () => {
    test('getter', () => {
      expect(attr(element, 'id')).toBe('elem_1');
      expect(attr('#elem_2', 'id')).toBe('elem_2');
    });

    describe('setter', () => {
      test('with attribute', () => {
        attr(element, 'id', 'elem_3');

        expect(attr(element, 'id')).toBe('elem_3');
      });

      test('with object', () => {
        attr(element, { id: 'elem_4', disabled: true });

        expect(attr(element, 'id')).toBe('elem_4');
        expect(attr(element, 'disabled')).toBeTruthy();
      });
    });
  });

  describe('removeAttr', () => {
    beforeEach(() => {
      element.setAttribute('disabled', true);
    });

    test('with attribute', () => {
      removeAttr(element, 'disabled');

      expect(element.getAttribute('disabled')).toBeNull();
    });

    test('with array', () => {
      removeAttr(element, ['id', 'disabled']);

      expect(element.getAttribute('disabled')).toBeNull();
      expect(element.getAttribute('id')).toBeNull();
    });
  });

  describe('data', () => {
    test('getter', () => {
      element.dataset.attribute = 'test';
      element.dataset.test = 'attribute';

      expect(Object.assign({}, data(element))).toEqual({ attribute: 'test', test: 'attribute' });
      expect(data(element, 'attribute')).toBe('test');
    });

    describe('setter', () => {
      test('with attribute', () => {
        data(element, 'attribute', 'test');

        expect(element.dataset.attribute).toBe('test');
      });

      test('with object', () => {
        data(element, { attribute: 'test', test: 'attribute' });

        expect(element.dataset.attribute).toBe('test');
        expect(element.dataset.test).toBe('attribute');
      });
    });
  });

  describe('removeData', () => {
    beforeEach(() => {
      element.dataset.attr1 = 'test1';
      element.dataset.attr2 = 'test2';
      element.dataset.attr3 = 'test3';
    });

    test('with attribute', () => {
      removeData(element, 'attr1');

      expect(element.dataset.attr1).toBeUndefined();
    });

    test('with array', () => {
      removeData(element, ['attr1', 'attr2']);

      expect(element.dataset.attr1).toBeUndefined();
      expect(element.dataset.attr2).toBeUndefined();
      expect(element.dataset.attr3).toBe('test3');
    });

    test('all', () => {
      removeData(element);

      expect(element.dataset.attr1).toBeUndefined();
      expect(element.dataset.attr2).toBeUndefined();
      expect(element.dataset.attr3).toBeUndefined();
    });
  });
});

describe('DOM', () => {
  beforeEach(() => {
    element.innerHTML = 'Some content for testing';
  });

  describe('insertHTML', () => {
    test('default/inner position', () => {
      insertHTML(element, 'Diferent content');

      expect(element.innerHTML).toBe('Diferent content');

      insertHTML(element, 'More diferent content', 'inner');

      expect(element.innerHTML).toBe('More diferent content');
    });

    test('prepend position', () => {
      insertHTML(element, 'Before div', 'prepend');

      expect(document.body.innerHTML).toBe('Before div<div>Some content for testing</div><div></div>');
    });

    test('append position', () => {
      insertHTML(element, 'After div', 'append');

      expect(document.body.innerHTML).toBe('<div>Some content for testing</div>After div<div></div>');
    });

    test('begin position', () => {
      insertHTML(element, '<span>Before content</span>', 'begin');

      expect(document.body.innerHTML).toBe('<div><span>Before content</span>Some content for testing</div><div></div>');
    });

    test('end position', () => {
      insertHTML(element, '<span>After content</span>', 'end');

      expect(document.body.innerHTML).toBe('<div>Some content for testing<span>After content</span></div><div></div>');
    });
  });

  test('elem', () => {
    element = elem('span', { id: 'new_span', class: 'test' });

    expect(element.tagName).toBe('SPAN');
    expect(element.getAttribute('id')).toBe('new_span');
    expect(element.getAttribute('class')).toBe('test');
  });
});
