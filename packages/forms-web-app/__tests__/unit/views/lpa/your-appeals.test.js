/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/lpa/your-appeals', () => {
	describe('when a user navigates to the your-appeals page', () => {
		it('should render the page title as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(`${VIEW.LPA_DASHBOARD.DASHBOARD}.njk`, {
				requestNewCodeLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`
			});
			expect(document.querySelector('title').textContent.trim()).toEqual(
				`Your appeals - Manage appeals - GOV.UK`
			);
		});
		it('should render the page heading as expected', () => {
			document.body.innerHTML = nunjucksTestRenderer.render(`${VIEW.LPA_DASHBOARD.DASHBOARD}.njk`, {
				requestNewCodeLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`
			});

			expect(document.querySelector('#main-content h1').textContent.trim()).toEqual(
				'Manage your appeals'
			);
		});
	});
});
