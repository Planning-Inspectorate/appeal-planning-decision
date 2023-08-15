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

		it('should render the users list', () => {
			const mockUsers = [
				{
					_id: '64ae8afd99f22900128ad54f',
					email: 'admin1@example.com',
					isAdmin: true,
					enabled: true,
					lpaCode: 'Q9999'
				},
				{
					_id: '64ae8afd99f22900128ad54f',
					email: 'user1@example.com',
					isAdmin: false,
					enabled: true,
					lpaCode: 'Q9999'
				}
			];
			document.body.innerHTML = nunjucksTestRenderer.render(
				`${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}.njk`,
				{
					dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
					addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
					users: mockUsers
				}
			);

			const users = document.querySelectorAll('#main-content dt');
			const removeLinks = document.querySelectorAll('#main-content dl a');

			expect(users.length).toBe(2);
			expect(removeLinks.length).toBe(1);
		});
	});
});
