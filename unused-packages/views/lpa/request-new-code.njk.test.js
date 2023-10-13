/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/request-new-code', () => {
	describe('when a code is requested by an LPA User', () => {
		it('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}.njk`,
				{
					requestNewCodeLink: `/${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}`
				}
			);
			expect(document.querySelector('title').textContent.trim()).toEqual(
				`Request a new code - Manage appeals - GOV.UK`
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}.njk`
			);

			expect(
				document
					.querySelector(
						'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > form > fieldset > legend > h1'
					)
					.textContent.trim()
			).toEqual('Enter your email address');
		});
		it('should render the errors as expected', () => {
			const customErrorSummary = [{ text: 'Enter a correct email address', href: '#' }];
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}.njk`,
				{
					errors: {},
					errorSummary: customErrorSummary
				}
			);

			expect(
				document
					.querySelector(
						'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div.govuk-error-summary > div > ul > li > a'
					)
					.textContent.trim()
			).toEqual(customErrorSummary[0].text);
		});
	});
});
