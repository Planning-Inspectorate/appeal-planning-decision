/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { getByTestId } = require('@testing-library/dom');
const {
  initialiseCookiePreferencePage,
} = require('../../../../../src/lib/client-side/cookie-preferences');

const getExampleDom = () => {
  const div = document.createElement('div');

  div.innerHTML = `
<span class="cookie-settings__no-js" data-testid="without"></span>
<span class="cookie-settings__with-js govuk-!-display-none" data-testid="with"></span>
    `;

  return div;
};

describe('lib/client-side/cookie-preferences', () => {
  const govUkDisplayNoneCssClass = 'govuk-!-display-none';

  let document;
  let elementWith;
  let elementWithout;

  beforeEach(() => {
    document = getExampleDom();

    elementWithout = getByTestId(document, 'without');
    elementWith = getByTestId(document, 'with');
  });

  test('calls the expected functions', () => {
    expect(elementWithout).not.toHaveClass(govUkDisplayNoneCssClass);
    expect(elementWith).toHaveClass(govUkDisplayNoneCssClass);

    initialiseCookiePreferencePage(document);

    expect(elementWithout).toHaveClass(govUkDisplayNoneCssClass);
    expect(elementWith).not.toHaveClass(govUkDisplayNoneCssClass);
  });
});
