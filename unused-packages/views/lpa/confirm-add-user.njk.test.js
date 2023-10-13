/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/confirm-add-user', () => {
	describe('when a user navigates to the confirm-add-user page', () => {
		it('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER}.njk`
			);
			expect(document.querySelector('title').textContent.trim()).toEqual(
				`Confirm you want to add this user - Manage appeals - GOV.UK`
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER}.njk`
			);

			console.log(document.body.innerHTML);

			expect(document.querySelector('#main-content h1').textContent.trim()).toEqual(
				'Confirm you want to add this user'
			);
		});

		it('should render the email address as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER}.njk`,
				{
					addUserEmailAddress: 'test@example.com'
				}
			);

			expect(document.querySelector('#main-content .govuk-body-l').textContent.trim()).toEqual(
				'test@example.com'
			);
		});
	});
});
