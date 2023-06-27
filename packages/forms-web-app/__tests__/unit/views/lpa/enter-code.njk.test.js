/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/enter-code', () => {
	describe('when a code is entered by an LPA User', () => {
		it.skip('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ENTER_CODE}.njk`,
				{
					requestNewCodeLink: `/${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}`
				}
			);

			expect(document.querySelector('title').textContent).toEqual(
				'Enter the code we sent to your email address - Manage appeals - GOV.UK'
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ENTER_CODE}.njk`,
				{
					requestNewCodeLink: `/${VIEW.LPA_DASHBOARD.REQUEST_NEW_CODE}`
				}
			);

			expect(
				document
					.querySelector(
						'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > form > fieldset > legend > h1'
					)
					.textContent.trim()
			).toEqual('Enter the code we sent to your email address');
		});
	});
});
