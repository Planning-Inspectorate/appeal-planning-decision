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
	appellant: 'Rachel Silver',
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
	it('should render the appeal site as expected', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(2) > dt'
				)
				.textContent.trim()
		).toEqual('Appeal site');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(2) > dd'
				)
				.textContent.trim()
		).toEqual('2 Aubrey House,Aubrey Road,,,BS3 3EX');
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
});
