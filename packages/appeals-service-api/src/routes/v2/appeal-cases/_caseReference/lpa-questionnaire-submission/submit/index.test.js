const supertest = require('supertest');
const http = require('http');
const app = require('../../../../../../app');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');

const server = http.createServer(app);
const appealsApi = supertest(server);

jest.mock('../service', () => ({
	getLPAQuestionnaireByAppealId: (/** @type {string} */ caseReference) => {
		switch (caseReference) {
			case '001':
				return {
					correctAppealType: true,
					affectsListedBuilding: true,
					affectedListedBuildingNumber: '10101',
					conservationArea: true,
					greenBelt: true,
					otherPartyRepresentations: true,
					lpaSiteSafetyRisks: true,
					lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails: "oh it's bad",
					lpaSiteAccess: true,
					neighbourSiteAccess: true,
					newConditions: true,
					newConditions_newConditionDetails: 'I have new conditions',
					nearbyAppealReference: '002',
					displaySiteNotice: true,
					lettersToNeighbours: true,
					pressAdvert: true,
					AppealCase: {
						LPACode: 'LPA_001',
						appealTypeCode: 'HAS'
					},
					SubmissionDocumentUpload: [
						{
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg'
						}
					]
				};
			case '002':
				// make this an S78 some day
				return { answers: {}, AppealCase: {}, SubmissionDocumentUpload: [] };
			default:
				return null;
		}
	}
}));

jest.mock('../../../../../../../src/configuration/featureFlag', () => ({
	isFeatureActive() {
		return true;
	}
}));

jest.mock('../../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));

jest.mock('../../../../../../../src/services/object-store', () => ({
	blobMetaGetter() {
		return async () => ({
			lastModified: '2024-03-01T14:48:35.847Z',
			createdOn: '2024-03-01T13:48:35.847Z',
			metadata: { mime_type: 'image/jpeg' },
			size: 10293,
			_response: { request: { url: 'https://example.com' } }
		});
	}
}));

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	it('Formats the given questionnaire then sends it to back office', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/001/lpa-questionnaire-submission/submit')
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-lpa-response-submission',
			[
				{
					questionnaire: {
						LPACode: 'LPA_001',
						caseReference: '001',
						isAppealTypeAppropriate: true,
						doesTheDevelopmentAffectTheSettingOfAListedBuilding: true,
						affectedListedBuildings: '10101',
						inCAOrRelatesToCA: true,
						siteWithinGreenBelt: true,
						howYouNotifiedPeople: [
							'A public notice at the site',
							'Letters to neighbours',
							'Advert in the local press'
						],
						hasRepresentationsFromOtherParties: true,
						doesSiteHaveHealthAndSafetyIssues: true,
						healthAndSafetyIssuesDetails: "oh it's bad",
						doesSiteRequireInspectorAccess: true,
						doPlansAffectNeighbouringSite: true,
						hasExtraConditions: true,
						extraConditions: 'I have new conditions',
						nearbyCaseReferences: '002'
					},
					documents: [
						{
							dateCreated: '2024-03-01T13:48:35.847Z',
							documentType: undefined,
							documentURI: 'https://example.com',
							filename: 'img.jpg',
							lastModified: '2024-03-01T14:48:35.847Z',
							mime: 'image/jpeg',
							origin: 'citizen',
							originalFilename: 'oimg.jpg',
							size: 10293,
							sourceSystem: 'appeals',
							stage: 'lpa_questionnaire'
						}
					]
				}
			],
			'Create'
		);
	});

	it('404s if the questionnaire can not be found', () => {
		appealsApi
			.post('/api/v2/appeal-cases/003/lpa-questionnaire-submission/submit')
			.expect(404)
			.end(() => {});
	});
});
