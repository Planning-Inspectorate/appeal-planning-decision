/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { cookieConsentHandler } = require('../../../../src/lib/client-side/cookie/cookie-consent');

const {
  initialiseOptionalJavaScripts,
} = require('../../../../src/lib/client-side/javascript-requiring-consent');

jest.mock('../../../../src/lib/client-side/cookie/cookie-consent');
jest.mock('../../../../src/lib/client-side/javascript-requiring-consent');

describe('lib/client-side/index', () => {
  test('calls the expected functions', () => {
    // eslint-disable-next-line global-require
    require('../../../../src/lib/client-side/index');

    expect(cookieConsentHandler).toHaveBeenCalledWith(document);
    expect(initialiseOptionalJavaScripts).toHaveBeenCalledWith(document);
  });
});
