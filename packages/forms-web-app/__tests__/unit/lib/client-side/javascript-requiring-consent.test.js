/**
 * @jest-environment jsdom
 */
const {
	initialiseOptionalJavaScripts
} = require('../../../../src/lib/client-side/javascript-requiring-consent');

const { readCookie } = require('../../../../src/lib/client-side/cookie/cookie-jar');
const { initialiseGoogleAnalytics } = require('../../../../src/lib/client-side/google-analytics');
const googleTagManager = require('../../../../src/lib/client-side/google-tag-manager');

jest.mock('../../../../src/lib/client-side/cookie/cookie-jar');
jest.mock('../../../../src/lib/client-side/google-analytics');
jest.mock('../../../../src/lib/client-side/google-tag-manager');

describe('lib/client-side/javascript-requiring-consent', () => {
	describe('initialiseOptionalJavaScripts', () => {
		beforeEach(() => {
			window.wfeconfig = {};
		});

		test('return early if cookie is null', () => {
			jest.spyOn(console, 'log').mockImplementation();

			readCookie.mockImplementation(() => null);

			initialiseOptionalJavaScripts();

			// eslint-disable-next-line no-console
			expect(console.log).toHaveBeenCalledWith('Consent not yet given for optional JavaScripts.');

			expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			expect(googleTagManager.grantConsent).not.toHaveBeenCalled();
		});

		test('return early if `usage` is not defined', () => {
			jest.spyOn(console, 'log').mockImplementation();

			readCookie.mockImplementation(() => JSON.stringify({ a: 'b' }));

			initialiseOptionalJavaScripts();

			expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			expect(googleTagManager.grantConsent).not.toHaveBeenCalled();
		});

		describe('tagmanager active', () => {
			beforeEach(() => {
				window.wfeconfig = {
					googleTagManager: true
				};
			});

			test('disables consent if `usage=false`', () => {
				window.wfeconfig.googleTagManagerId = '123';

				jest.spyOn(console, 'log').mockImplementation();

				readCookie.mockImplementation(() => JSON.stringify({ usage: false }));

				initialiseOptionalJavaScripts();

				expect(googleTagManager.denyConsent).toHaveBeenCalled();
				expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			});

			test('enables consent if `usage=true`', () => {
				window.wfeconfig.googleTagManagerId = '123';

				readCookie.mockImplementation(() => JSON.stringify({ usage: true }));

				initialiseOptionalJavaScripts();

				expect(googleTagManager.grantConsent).toHaveBeenCalled();
				expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			});

			test('does not enable consent if no tag manager id present', () => {
				window.wfeconfig.googleTagManagerId = undefined;

				readCookie.mockImplementation(() => JSON.stringify({ usage: true }));

				initialiseOptionalJavaScripts();

				expect(googleTagManager.grantConsent).not.toHaveBeenCalled();
				expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			});
		});

		describe('tagmanager inactive', () => {
			beforeEach(() => {
				window.wfeconfig = {
					googleTagManager: false
				};
			});

			test('return early if `usage=false`', () => {
				jest.spyOn(console, 'log').mockImplementation();

				readCookie.mockImplementation(() => JSON.stringify({ usage: false }));

				initialiseOptionalJavaScripts();

				expect(googleTagManager.grantConsent).not.toHaveBeenCalled();
				expect(initialiseGoogleAnalytics).not.toHaveBeenCalled();
			});

			test('calls through if `usage=true`', () => {
				readCookie.mockImplementation(() => JSON.stringify({ usage: true }));

				initialiseOptionalJavaScripts();

				expect(googleTagManager.grantConsent).not.toHaveBeenCalled();
				expect(initialiseGoogleAnalytics).toHaveBeenCalled();
			});
		});
	});
});
