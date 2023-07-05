/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/add-remove-users', () => {
	describe('when a user navigates to the add-remove-users page', () => {
		it('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}.njk`,
				{
					dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
					addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`
				}
			);
			expect(document.querySelector('title').textContent.trim()).toEqual(
				`Add and remove users - Manage appeals - GOV.UK`
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}.njk`,
				{
					dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
					addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`
				}
			);

			expect(document.querySelector('#main-content h1').textContent.trim()).toEqual(
				'Add and remove users'
			);
		});

		it('should render the backlink as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}.njk`,
				{
					dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
					addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`
				}
			);

			const link = document.querySelector('#main-content a');

			expect(link.getAttribute('href')).toBe(`/${VIEW.LPA_DASHBOARD.DASHBOARD}`);
		});
	});
});
