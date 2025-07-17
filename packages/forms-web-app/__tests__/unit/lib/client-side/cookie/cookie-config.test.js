const cookieConfig = require('../../../../../src/lib/client-side/cookie/cookie-config');

describe('lib/client-side/cookie/cookie-environments', () => {
	test('COOKIE_POLICY_KEY', () => {
		expect(cookieConfig.COOKIE_POLICY_KEY).toEqual('cookie_policy');
	});

	test('CSS_CLASSES', () => {
		expect(cookieConfig.CSS_CLASSES).toEqual({
			displayNone: 'govuk-!-display-none'
		});
	});

	test('DEFAULT_COOKIE_POLICY', () => {
		expect(cookieConfig.DEFAULT_COOKIE_POLICY).toEqual({
			essential: true,
			settings: false,
			usage: false,
			campaigns: false
		});
	});

	test('SELECTORS', () => {
		expect(cookieConfig.SELECTORS).toEqual({
			button: {
				cookieBanner: {
					consent: 'button[name="cookie_banner"]',
					accepted: 'button[name="cookie_banner_accepted"]',
					rejected: 'button[name="cookie_banner_rejected"]'
				}
			},
			cookieBanner: {
				consent: '#cookie-banner-consent',
				accepted: '#cookie-banner-accepted',
				rejected: '#cookie-banner-rejected'
			}
		});
	});
});
