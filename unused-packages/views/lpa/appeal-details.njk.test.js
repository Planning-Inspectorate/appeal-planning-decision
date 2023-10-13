/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');
const appeal = {
	caseReference: '1345264',
	appealType: 'Householder appeal',
	siteAddressLine1: '2 Aubrey House',
	siteAddressLine2: 'Aubrey Road',
	siteAddressTown: '',
	siteAddressCounty: '',
	siteAddressPostcode: 'BS3 3EX',
	appellant: {
		firstName: 'Rachel',
		lastName: 'Silver'
	},
	LPAApplicationReference: '23/04125/FUL'
};
describe('./src/views/manage-appeals/appeal-details.njk', () => {
	it('should render the title as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > h1'
				)
				.textContent.trim()
				.replace('Appeal ', '')
		).toEqual(appeal.caseReference);
	});
	it('should render the appeal type as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(1) > dt'
				)
				.textContent.trim()
		).toEqual('Appeal type');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(1) > dd'
				)
				.textContent.trim()
		).toEqual('Householder appeal');
	});
	it('should render the applicant as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(3) > dt'
				)
				.textContent.trim()
		).toEqual('Applicant');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(3) > dd'
				)
				.textContent.trim()
		).toEqual('Rachel Silver');
	});
	it('should render the application number as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(4) > dt'
				)
				.textContent.trim()
		).toEqual('Application number');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(4) > dd'
				)
				.textContent.trim()
		).toEqual('23/04125/FUL');
	});
	it('should not render a row for agent or representitive if there is none', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);
		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div.govuk-grid-column-two-thirds > dl > div:nth-child(1) > dt'
				)
				.textContent.trim()
		).toEqual('Site ownership');
	});
	it('should render a row for agent or representitive if there is one', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: {
					...appeal,
					agent: [
						{
							firstName: 'Ray',
							lastName: 'Gent'
						}
					]
				}
			}
		);
		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div.govuk-grid-column-two-thirds > dl > div:nth-child(1) > dt'
				)
				.textContent.trim()
		).toEqual('Agent or representative');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div.govuk-grid-column-two-thirds > dl > div:nth-child(1) > dd'
				)
				.textContent.trim()
		).toEqual('Ray Gent');
	});
	it('should render Yes or No for boolean value of site visibility', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			Array.from(document.querySelectorAll('dt'))
				.filter(
					(dt) => dt.firstChild.textContent.trim() === 'Site visible from a public road or footpath'
				)[0]
				.nextSibling.nextSibling.textContent.trim()
		).toEqual('No');

		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: {
					...appeal,
					isSiteVisible: true
				}
			}
		);

		expect(
			Array.from(document.querySelectorAll('dt'))
				.filter(
					(dt) => dt.firstChild.textContent.trim() === 'Site visible from a public road or footpath'
				)[0]
				.nextSibling.nextSibling.textContent.trim()
		).toEqual('Yes');
	});
	it('should render Yes or No for boolean value of health and safety issues', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: {
					...appeal,
					doesSiteHaveHealthAndSafetyIssues: true,
					healthAndSafetyIssuesDetails: 'healthAndSafetyIssuesDetails'
				}
			}
		);

		expect(
			Array.from(document.querySelectorAll('dt'))
				.filter((dt) => dt.firstChild.textContent.trim() === 'Health and safety issues')[0]
				.nextSibling.nextSibling.textContent.trim()
				.substring(0, 3)
		).toEqual('Yes');

		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: {
					...appeal,
					doesSiteHaveHealthAndSafetyIssues: false
				}
			}
		);

		expect(
			Array.from(document.querySelectorAll('dt'))
				.filter((dt) => dt.firstChild.textContent.trim() === 'Health and safety issues')[0]
				.nextSibling.nextSibling.textContent.trim()
		).toEqual('No');
	});
});
