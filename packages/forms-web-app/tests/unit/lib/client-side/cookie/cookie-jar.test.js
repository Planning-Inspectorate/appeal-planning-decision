/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const {
  createCookie,
  readCookie,
  eraseCookie,
} = require('../../../../../src/lib/client-side/cookie/cookie-jar');

describe('lib/client-side/cookie/cookie-jar', () => {
  let document;

  const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00Z';
  const fakeName = 'some_cookie_name';
  const fakeValue = 'some fake value';

  beforeEach(() => {
    document = {
      cookie: '',
    };

    // https://github.com/facebook/jest/issues/2234#issuecomment-730037781
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createCookie', () => {
    test('without days - gets default expiry', () => {
      createCookie(document, fakeName, fakeValue);

      expect(document.cookie).toEqual(
        `${fakeName}=${fakeValue}; expires=Fri, 25 Oct 2120 00:00:00 GMT; path=/`
      );
    });

    test('with positive days', () => {
      createCookie(document, fakeName, fakeValue, 30);

      expect(document.cookie).toEqual(
        `${fakeName}=${fakeValue}; expires=Fri, 18 Dec 2020 00:00:00 GMT; path=/`
      );
    });

    test('with 0 days', () => {
      createCookie(document, fakeName, '', 0);

      expect(document.cookie).toEqual(
        `${fakeName}=; expires=Wed, 18 Nov 2020 00:00:00 GMT; path=/`
      );
    });

    test('with negative days', () => {
      createCookie(document, fakeName, '', -2);

      expect(document.cookie).toEqual(
        `${fakeName}=; expires=Mon, 16 Nov 2020 00:00:00 GMT; path=/`
      );
    });

    test('bad days - we all have them', () => {
      createCookie(document, fakeName, '', 'some string?');

      expect(document.cookie).toEqual(`${fakeName}=; path=/`);
    });
  });

  describe('readCookie', () => {
    test('when cookie does not exist', () => {
      expect(readCookie(document, 'invalid cookie name')).toBeNull();
    });

    test('when one cookie exists', () => {
      createCookie(document, fakeName, fakeValue);

      expect(readCookie(document, fakeName)).toEqual(fakeValue);
    });

    test('when many cookies exists', () => {
      document.cookie = 'a=b; c=d; e=f;';

      expect(readCookie(document, 'c')).toEqual('d');
    });
  });

  test('eraseCookie', () => {
    createCookie(document, fakeName, fakeValue);

    eraseCookie(document, fakeName);

    expect(document.cookie).toEqual(`${fakeName}=; expires=Tue, 17 Nov 2020 00:00:00 GMT; path=/`);
  });
});
