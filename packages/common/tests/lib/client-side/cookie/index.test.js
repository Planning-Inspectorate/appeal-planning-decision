/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { initialiseCookieConsent } = require('../../../../src/lib/client-side/cookie/index');

const { cookieConsentHandler } = require('../../../../src/lib/client-side/cookie/cookie-consent');

const { readCookie } = require('../../../../src/lib/client-side/cookie/cookie-jar');

jest.mock('../../../../src/lib/client-side/cookie/cookie-jar');
jest.mock('../../../../src/lib/client-side/cookie/cookie-consent');

const getExampleDom = () => document.createElement('div');

describe('lib/client-side/cookie/index', () => {
  let document;

  beforeEach(() => {
    document = getExampleDom();
  });

  describe('initialiseCookieConsent', () => {
    test('when cookie is null', () => {
      readCookie.mockImplementation(() => null);

      initialiseCookieConsent(document);

      expect(cookieConsentHandler).toHaveBeenCalledWith(document);
    });

    test('when cookie is not null', () => {
      readCookie.mockImplementation(() => 'a value');

      initialiseCookieConsent(document);

      expect(cookieConsentHandler).not.toHaveBeenCalled();
    });
  });
});
