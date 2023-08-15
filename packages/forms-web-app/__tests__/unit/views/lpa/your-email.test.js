/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/your-email-address', () => {
	it('should render the page title as expected', () => {
		const title = 'Enter your email address - Manage my appeals - Planning Inspectorate';
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}.njk`,
			{
				title: title
			}
		);

		expect(document.querySelector('title').textContent.trim()).toEqual(title);
	});
	it('should render the page heading as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}.njk`
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > form > label'
				)
				.textContent.trim()
		).toEqual('Enter your email address');
	});
});
