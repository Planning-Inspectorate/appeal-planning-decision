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
	agent: [
		{
			firstName: 'Ray',
			lastName: 'Gent'
		}
	],
	LPAApplicationReference: '23/04125/FUL'
};
const documents = {
	applicationForm: {
		filename: 'Aubrey House planning application 2023.pdf',
		documentURI: 'Aubrey House planning application 2023.pdf'
	}
};

describe('./src/views/manage-appeals/appeal-details.njk', () => {
	it('should render the application form in row 5 of the summary table', () => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}.njk`,
			{
				appeal: appeal,
				documents: documents
			}
		);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(5) > dt'
				)
				.textContent.trim()
		).toEqual('Application form');

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(5) > dd > a'
				)
				.textContent.trim()
		).toEqual(documents.applicationForm.filename);

		expect(
			document
				.querySelector(
					'#main-content > div.govuk-main-wrapper.govuk-main-wrapper--auto-spacing > div > div > dl > div:nth-child(5) > dd > a'
				)
				.getAttribute('href')
		).toEqual(documents.applicationForm.documentURI);
	});
});
