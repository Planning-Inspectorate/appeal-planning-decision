const {
  initialiseOptionalJavaScripts,
} = require('../../../../src/lib/client-side/javascript-requiring-consent');

const { readCookie } = require('../../../../src/lib/client-side/cookie/cookie-jar');
const { initialiseGoogleAnalytics } = require('../../../../src/lib/client-side/google-analytics');

jest.mock('../../../../src/lib/client-side/cookie/cookie-jar');
jest.mock('../../../../src/lib/client-side/google-analytics');

describe('lib/client-side/javascript-requiring-consent', () => {
  describe('initialiseOptionalJavaScripts', () => {
    test('return early if cookie is null', () => {
      jest.spyOn(console, 'log').mockImplementation();

      readCookie.mockImplementation(() => null);

      initialiseOptionalJavaScripts();

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith('Consent not yet given for optional JavaScripts.');

      expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
    });

    test('return early if `usage` is not defined', () => {
      jest.spyOn(console, 'log').mockImplementation();

      readCookie.mockImplementation(() => JSON.stringify({ a: 'b' }));

      initialiseOptionalJavaScripts();

      expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
    });

    test('return early if `usage=false`', () => {
      jest.spyOn(console, 'log').mockImplementation();

      readCookie.mockImplementation(() => JSON.stringify({ usage: false }));

      initialiseOptionalJavaScripts();

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(
        'Declined consent. Third party cookies are not enabled.'
      );

      expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
    });

    test('calls through if `usage=true`', () => {
      readCookie.mockImplementation(() => JSON.stringify({ usage: true }));

      initialiseOptionalJavaScripts();

      expect(initialiseGoogleAnalytics).toHaveBeenCalled();
    });
  });
});
