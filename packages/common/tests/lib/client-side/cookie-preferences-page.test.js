/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const {
  initialiseCookiePreferencePage,
} = require('../../../src/lib/client-side/cookie-preferences');

jest.mock('../../../src/lib/client-side/cookie-preferences');

describe('lib/client-side/cookie-preferences-page', () => {
  test('calls the expected functions', () => {
    // eslint-disable-next-line global-require
    require('../../../src/lib/client-side/cookie-preferences-page');

    expect(initialiseCookiePreferencePage).toHaveBeenCalledWith(document);
  });
});
