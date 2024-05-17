// NOTE - Tests are skipped for time being as relies upon formatting for BO submission and
// format not yet confirmed

const supertest = require('supertest');
const http = require('http');
const app = require('../../../../../app');
const { sendEvents } = require('../../../../../../src/infrastructure/event-client');

const server = http.createServer(app);
const appealsApi = supertest(server);

/**
 * @typedef {import('../appellant-submission').AppellantSubmission} AppellantSubmission
 */

jest.mock('../service', () => ({
	/**
	 * @returns {Partial<AppellantSubmission> | null}
	 */
	get: (appellantSubmissionId) => {
		switch (appellantSubmissionId) {
			case '001':
				return {
					LPACode: 'LPA_001',
					appealTypeCode: 'HAS',
					applicationDecisionDate: '2024-01-01',
					applicationDecision: 'denied',
					onApplicationDate: '2024-01-01',
					isAppellant: true,
					contactFirstName: 'Testy',
					contactLastName: 'McTest',
					appellantEmailAddress: 'test@test.com',
					ownsAllLand: true,
					appellantGreenBelt: false,
					updateDevelopmentDescription: false,
					costApplication: false,
					appellantSiteSafety: 'yes',
					appellantSiteSafety_appellantSiteSafetyDetails: "It's dangerous",
					appellantSiteAccess: 'yes',
					appellantSiteAccess_appellantSiteAccessDetails: 'Come and see',
					applicationReference: '123',
					developmentDescriptionOriginal: 'A test description',
					appellantLinkedCaseReference: 'no',
					appellantPhoneNumber: '12345657',
					siteAreaSquareMetres: 22.0,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					SubmissionLinkedCase: [],
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false,
					SubmissionDocumentUpload: [
						{
							id: 'img_001',
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							appellantSubmissionId: '001',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							storageId: '001'
						}
					],
					siteAddress: true,
					SubmissionAddress: [
						{
							id: 'add_001',
							appellantSubmissionId: '001',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							fieldName: 'siteAddress'
						}
					],
					SubmissionListedBuilding: []
				};
			case '002':
				return {
					LPACode: 'LPA_002',
					appealTypeCode: 'HAS',
					applicationDecisionDate: '2024-01-01',
					applicationDecision: 'denied',
					onApplicationDate: '2024-01-01',
					isAppellant: false,
					appellantFirstName: 'Test App',
					appellantLastName: 'Testington',
					appellantEmailAddress: 'test@test.com',
					contactFirstName: 'Testy',
					contactLastName: 'McTest',
					contactCompanyName: 'Test Agents',
					ownsAllLand: true,
					appellantGreenBelt: false,
					updateDevelopmentDescription: false,
					costApplication: false,
					appellantSiteSafety: 'yes',
					appellantSiteSafety_appellantSiteSafetyDetails: "It's dangerous",
					appellantSiteAccess: 'yes',
					appellantSiteAccess_appellantSiteAccessDetails: 'Come and see',
					applicationReference: '234',
					developmentDescriptionOriginal: 'A test description',
					appellantLinkedCaseReference: 'no',
					appellantPhoneNumber: '12345657',
					siteAreaSquareMetres: 25.0,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					SubmissionLinkedCase: [],
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false,
					SubmissionDocumentUpload: [
						{
							id: 'img_002',
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							appellantSubmissionId: '002',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							storageId: '001'
						}
					],
					siteAddress: true,
					SubmissionAddress: [
						{
							id: 'add_002',
							appellantSubmissionId: '002',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							fieldName: 'siteAddress'
						}
					],
					SubmissionListedBuilding: []
				};
			default:
				return null;
		}
	}
}));

jest.mock('../../../../../../src/configuration/featureFlag', () => ({
	isFeatureActive() {
		return true;
	}
}));

jest.mock('../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));

jest.mock('../../../../../../src/services/object-store');

const formattedHAS1 = {
	appeal: {
		LPACode: 'LPA_001',
		LPAName: 'testLPA',
		appealType: 'Householder (HAS) Appeal',
		decision: 'denied',
		originalCaseDecisionDate: '2024-01-01',
		costAppliedForIndicator: false,
		LPAApplicationReference: '123',
		appellant: {
			firstName: 'Testy',
			lastName: 'McTest',
			emailAddress: 'test@test.com'
		},
		agent: undefined,
		siteAddressLine1: 'Somewhere',
		siteAddressLine2: 'Somewhere St',
		siteAddressTown: 'Somewhereville',
		siteAddressCounty: undefined,
		siteAddressPostcode: 'SOM3 W3R',
		isSiteFullyOwned: true,
		hasToldOwners: undefined,
		isSiteVisible: 'yes',
		inspectorAccessDetails: 'Come and see',
		doesSiteHaveHealthAndSafetyIssues: 'yes',
		healthAndSafetyIssuesDetails: "It's dangerous"
	},
	documents: []
};

const formattedHAS2 = {
	appeal: {
		LPACode: 'LPA_002',
		LPAName: 'testLPA',
		appealType: 'Householder (HAS) Appeal',
		decision: 'denied',
		originalCaseDecisionDate: '2024-01-01',
		costAppliedForIndicator: false,
		LPAApplicationReference: '234',
		appellant: {
			firstName: 'Test App',
			lastName: 'Testington',
			emailAddress: 'test@test.com'
		},
		agent: {
			firstName: 'Testy',
			lastName: 'McTest',
			emailAddress: 'test@test.com'
		},
		siteAddressLine1: 'Somewhere',
		siteAddressLine2: 'Somewhere St',
		siteAddressTown: 'Somewhereville',
		siteAddressCounty: undefined,
		siteAddressPostcode: 'SOM3 W3R',
		isSiteFullyOwned: true,
		hasToldOwners: undefined,
		isSiteVisible: 'yes',
		inspectorAccessDetails: 'Come and see',
		doesSiteHaveHealthAndSafetyIssues: 'yes',
		healthAndSafetyIssuesDetails: "It's dangerous"
	},
	documents: []
};

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	it.skip.each([
		['HAS', '001', formattedHAS1],
		['HAS', '002', formattedHAS2]
	])('Formats %s appeal submission then sends it to back office', async (_, id, expectation) => {
		await appealsApi
			.post(`/api/v2/appellant-submissions/${id}/submit`)
			.set('Authorization', 'test123')
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-lpa-response-submission',
			expectation,
			'Create'
		);
	});

	it.skip('404s if the appeal submission can not be found', () => {
		appealsApi
			.post('/api/v2/appellant-submissions/003/submit')
			.expect(404)
			.end(() => {});
	});
});
