/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { getByTestId } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const cookieConfig = require('../../../../../src/lib/client-side/cookie/cookie-config');
const {
	addRejectCookieConsentListener,
	addAcceptCookieConsentListener,
	cookieConsentHandler,
	displayConsentButtons,
	getConsentButtons,
	hideConsentBanner,
	setCookies
} = require('../../../../../src/lib/client-side/cookie/cookie-consent');

const {
	createCookie,
	eraseCookie,
	readCookie
} = require('../../../../../src/lib/client-side/cookie/cookie-jar');

const {
	showCookieConsentAcceptedBanner
} = require('../../../../../src/lib/client-side/cookie/cookie-consent-accepted');

const {
	showCookieConsentRejectedBanner
} = require('../../../../../src/lib/client-side/cookie/cookie-consent-rejected');

const {
	initialiseOptionalJavaScripts
} = require('../../../../../src/lib/client-side/javascript-requiring-consent');

jest.mock('../../../../../src/lib/client-side/cookie/cookie-jar');
jest.mock('../../../../../src/lib/client-side/cookie/cookie-consent-accepted');
jest.mock('../../../../../src/lib/client-side/cookie/cookie-consent-rejected');
jest.mock('../../../../../src/lib/client-side/javascript-requiring-consent');

const govUkDisplayNoneCssClass = 'govuk-!-display-none';

const getExampleDom = ({ withAccept, withReject } = { withAccept: true, withReject: true }) => {
	const div = document.createElement('div');

	div.innerHTML = `
<div id="cookie-banner-consent" data-testid="cookie-banner-consent">
 ${
		withAccept &&
		`<button
   name="cookie_banner"
   class="${govUkDisplayNoneCssClass}"
   data-testid="cookie-banner-accept"
   type="submit"
   value="accept">
   Accept
 </button>`
 }
 ${
		withReject &&
		`<button
   name="cookie_banner"
   class="${govUkDisplayNoneCssClass}"
   data-testid="cookie-banner-reject"
   type="submit"
   value="reject">
   Reject
 </button>`
 }
</div>
    `;

	return div;
};

describe('lib/client-side/cookie/cookie-consent', () => {
	let document;
	let consentBanner;
	let acceptButton;
	let rejectButton;

	beforeEach(() => {
		document = getExampleDom();

		consentBanner = getByTestId(document, 'cookie-banner-consent');
		acceptButton = getByTestId(document, 'cookie-banner-accept');
		rejectButton = getByTestId(document, 'cookie-banner-reject');

		expect(consentBanner).not.toHaveClass(govUkDisplayNoneCssClass);
		expect(acceptButton).toHaveClass(govUkDisplayNoneCssClass);
		expect(rejectButton).toHaveClass(govUkDisplayNoneCssClass);
	});

	test('setCookies', () => {
		const fakePolicy = { a: 'b' };
		setCookies(document, fakePolicy);

		expect(eraseCookie).toHaveBeenCalledWith(document, cookieConfig.COOKIE_POLICY_KEY);
		expect(createCookie).toHaveBeenCalledWith(
			document,
			cookieConfig.COOKIE_POLICY_KEY,
			JSON.stringify(fakePolicy)
		);
	});

	test('hideConsentBanner', () => {
		hideConsentBanner(document);
		expect(consentBanner).toHaveClass(govUkDisplayNoneCssClass);
	});

	test('getConsentButtons', () => {
		const { allConsentButtons, acceptCookieConsentButton, rejectCookieConsentButton } =
			getConsentButtons(document);

		expect(acceptCookieConsentButton).toBe(acceptButton);
		expect(rejectCookieConsentButton).toBe(rejectButton);

		expect(allConsentButtons).toHaveLength(2);
		expect(allConsentButtons[0]).toBe(acceptButton);
		expect(allConsentButtons[1]).toBe(rejectButton);
	});

	test('displayConsentButtons', () => {
		const { allConsentButtons } = getConsentButtons(document);

		displayConsentButtons(allConsentButtons);

		expect(acceptButton).not.toHaveClass(govUkDisplayNoneCssClass);
		expect(rejectButton).not.toHaveClass(govUkDisplayNoneCssClass);
	});

	test('addAcceptCookieConsentListener', () => {
		addAcceptCookieConsentListener(document, acceptButton);

		userEvent.click(acceptButton);

		expect(eraseCookie).toHaveBeenCalledWith(document, cookieConfig.COOKIE_POLICY_KEY);
		expect(createCookie).toHaveBeenCalledWith(
			document,
			cookieConfig.COOKIE_POLICY_KEY,
			JSON.stringify({
				...cookieConfig.DEFAULT_COOKIE_POLICY,
				usage: true
			})
		);

		expect(consentBanner).toHaveClass(govUkDisplayNoneCssClass);

		expect(showCookieConsentAcceptedBanner).toHaveBeenCalledWith(document);
		expect(initialiseOptionalJavaScripts).toHaveBeenCalled();
	});

	test('addRejectCookieConsentListener', () => {
		addRejectCookieConsentListener(document, rejectButton);

		userEvent.click(rejectButton);

		expect(eraseCookie).toHaveBeenCalledWith(document, cookieConfig.COOKIE_POLICY_KEY);
		expect(createCookie).toHaveBeenCalledWith(
			document,
			cookieConfig.COOKIE_POLICY_KEY,
			JSON.stringify(cookieConfig.DEFAULT_COOKIE_POLICY)
		);

		expect(consentBanner).toHaveClass(govUkDisplayNoneCssClass);

		expect(showCookieConsentRejectedBanner).toHaveBeenCalledWith(document);
		expect(initialiseOptionalJavaScripts).not.toHaveBeenCalled();
	});

	describe('cookieConsentHandler', () => {
		[
			getExampleDom({ withAccept: false, withReject: true }),
			getExampleDom({ withAccept: true, withReject: false })
		].forEach((dom) => {
			test(`return early if required element is undefined`, () => {
				readCookie.mockImplementation(() => null);

				cookieConsentHandler(dom);

				expect(createCookie).not.toHaveBeenCalled();
			});
		});

		test('cookie policy has already been set', () => {
			readCookie.mockImplementation(() => true);

			cookieConsentHandler(document);

			expect(consentBanner).toHaveClass(govUkDisplayNoneCssClass);
			expect(createCookie).not.toHaveBeenCalled();
		});

		test('cookie policy has not yet been set', () => {
			readCookie.mockImplementation(() => null);

			cookieConsentHandler(document);

			expect(consentBanner).not.toHaveClass(govUkDisplayNoneCssClass);
			expect(acceptButton).not.toHaveClass(govUkDisplayNoneCssClass);
			expect(rejectButton).not.toHaveClass(govUkDisplayNoneCssClass);
		});
	});
});
