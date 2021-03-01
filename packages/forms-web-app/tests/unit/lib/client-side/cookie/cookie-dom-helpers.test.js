/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { getByTestId } = require('@testing-library/dom');
const domHelpers = require('../../../../../src/lib/client-side/cookie/cookie-dom-helpers');

const getExampleDom = () => {
  const div = document.createElement('div');

  div.innerHTML = `
<span class="initially-hidden-span govuk-!-display-none" data-testid="initially-hidden"></span>
<span class="initially-visible-span" data-testid="initially-visible"></span>
    `;

  return div;
};

describe('lib/client-side/cookie/cookie-dom-helpers', () => {
  const govUkDisplayNoneCssClass = 'govuk-!-display-none';

  let document;
  let elementInitiallyHidden;
  let elementInitiallyVisible;

  beforeEach(() => {
    document = getExampleDom();

    elementInitiallyHidden = getByTestId(document, 'initially-hidden');
    elementInitiallyVisible = getByTestId(document, 'initially-visible');
  });

  describe('showSingleDomElementBySelector', () => {
    test('can show a hidden element', () => {
      expect(elementInitiallyHidden).toHaveClass(govUkDisplayNoneCssClass);
      domHelpers.showSingleDomElementBySelector(document, '.initially-hidden-span');
      expect(elementInitiallyHidden).not.toHaveClass(govUkDisplayNoneCssClass);
    });

    test('showing an already shown element', () => {
      expect(elementInitiallyVisible).not.toHaveClass(govUkDisplayNoneCssClass);
      domHelpers.showSingleDomElementBySelector(document, '.initially-visible-span');
      expect(elementInitiallyVisible).not.toHaveClass(govUkDisplayNoneCssClass);
    });
  });

  describe('hideSingleDomElementBySelector', () => {
    test('can hide a visible element', () => {
      expect(elementInitiallyVisible).not.toHaveClass(govUkDisplayNoneCssClass);
      domHelpers.hideSingleDomElementBySelector(document, '.initially-visible-span');
      expect(elementInitiallyVisible).toHaveClass(govUkDisplayNoneCssClass);
    });

    test('hiding an already hidden element', () => {
      expect(elementInitiallyHidden).toHaveClass(govUkDisplayNoneCssClass);
      domHelpers.hideSingleDomElementBySelector(document, '.initially-hidden-span');
      expect(elementInitiallyHidden).toHaveClass(govUkDisplayNoneCssClass);
    });
  });
});
