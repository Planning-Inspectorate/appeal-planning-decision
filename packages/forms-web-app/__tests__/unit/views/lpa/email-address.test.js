/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/enter-email', () => {
	describe('when a user navigates to the enter-email page', () => {
		it('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}.njk`
			);
			expect(document.querySelector('title').textContent.trim()).toEqual(
				`What is their email address? - Manage appeals - GOV.UK`
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}.njk`
			);

			expect(
				document.querySelector('#main-content label:first-of-type').textContent.trim()
			).toEqual('What is their email address?');
		});

		it('should render the label suffix as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}.njk`,
				{
					lpaDomain: 'test'
				}
			);

			expect(
				document
					.querySelector('#main-content .govuk-input__suffix:first-of-type')
					.textContent.trim()
			).toEqual('test');
		});
	});
});
