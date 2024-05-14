// NOTE - Test is commented out for time being as relies upon formatting for BO submission and
// format not yet confirmed

// const supertest = require('supertest');
// const http = require('http');
// const app = require('../../../../../../app');
// const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');

// const server = http.createServer(app);
// const appealsApi = supertest(server);

// /**
//  * @typedef {import('../../../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
//  */

// jest.mock('../service', () => ({
// 	/**
// 	 * @param {{string:, string}} caseReference
// 	 * @returns {Partial<LPAQuestionnaireSubmission> | null}
// 	 */
// 	get: ({appellantSubmissionId, userID}) => {
// 		switch (appellantSubmissionId) {
// 			case '001':
// 				return {
// 					LPACode: 'LPA_001',
// 					appealTypeCode: 'HAS',
// 					applicationDecisionDate: '2024-01-01',
// 					applicationDecision: 'denied',
// 					onApplicationDate: '2024-01-01',
// 					isAppellant: true,
// 					// appellantFirstName:   String?
// 					// appellantLastName:    String?
// 					// appellantCompanyName: String?
// 					contactFirstName: 'Testy',
// 					contactLastName: 'McTest',
// 					// contactCompanyName:   String?
// 					ownsAllLand: true,
// 					// ownsSomeLand:                 Boolean?
// 					// knowsAllOwners:               String?
// 					// knowsOtherOwners:             String?
// 					// informedOwners:               Boolean?
// 					// advertisedAppeal:             Boolean?
// 					appellantGreenBelt: false,
// 					updateDevelopmentDescription: false,
// 					// identifiedOwners:             Boolean?
// 					costApplication: false,
// 					appellantSiteSafety: 'yes',
// 					appellantSiteSafety_appellantSiteSafetyDetails: "It's dangerous",
// 					appellantSiteAccess: 'yes',
// 					appellantSiteAccess_appellantSiteAccessDetails: "Come and see",
// 					applicationReference: '123',
// 					developmentDescriptionOriginal: 'A test description',
// 					appellantLinkedCaseReference: 'no',
// 					appellantPhoneNumber: '12345657',
// 					siteAreaSquareMetres: 22.0,
// 					appellantLinkedCaseAdd: false,
// 					appellantLinkedCase: false,
// 					SubmissionLinkedCase:[],
// 					uploadOriginalApplicationForm: true,
// 					uploadApplicationDecisionLetter: false,
// 					uploadAppellantStatement: false,
// 					uploadCostApplication: false,
// 					uploadChangeOfDescriptionEvidence: false,
// 					SubmissionDocumentUpload: [
// 						{
// 							id: 'img_001',
// 							fileName: 'img.jpg',
// 							originalFileName: 'oimg.jpg',
// 							questionnaireId: '001',
// 							name: 'img.jpg',
// 							location: '/img.jpg',
// 							type: 'jpg'
// 						}
// 					],
// 					siteAddress: true,
// 					SubmissionAddress: [
// 						{
// 							id: 'add_001',
// 							questionnaireId: '001',
// 							addressLine1: 'Somewhere',
// 							addressLine2: 'Somewhere St',
// 							townCity: 'Somewhereville',
// 							postcode: 'SOM3 W3R'
// 						}
// 					],
// 					SubmissionListedBuilding: []
// 				};
// 			case '002':
// 				return {
// 					addChangedListedBuilding: true,
// 					areaOutstandingBeauty: true,
// 					changesListedBuilding: true,
// 					changedListedBuildingNumber: '010101',
// 					columnTwoThreshold: true,
// 					environmentalStatement: true,
// 					consultationResponses: true,
// 					statutoryConsultees_consultedBodiesDetails: 'consultation details',
// 					designatedSites: 'yes',
// 					developmentDescription: '',
// 					emergingPlan: true,
// 					environmentalImpactSchedule: '',
// 					gypsyTraveller: true,
// 					infrastructureLevy: false,
// 					infrastructureLevyAdopted: false,
// 					infrastructureLevyAdoptedDate: null,
// 					infrastructureLevyExpectedDate: null,
// 					lpaPreferHearingDetails: 'Hearing details',
// 					lpaPreferInquiryDetails: 'Inquiry details',
// 					lpaProcedurePreference_lpaPreferInquiryDuration: 'Very long',
// 					lpaProcedurePreference: 'Hearing',
// 					designatedSites_otherDesignations: 'other designations',
// 					protectedSpecies: false,
// 					publicRightOfWay: true,
// 					affectsScheduledMonument: true,
// 					screeningOpinion: false,
// 					sensitiveArea: 'yes',
// 					sensitiveArea_sensitiveAreaDetails: 'Sensitive area details',
// 					statutoryConsultees: 'Mrs Consultee',
// 					supplementaryPlanningDocs: true,
// 					treePreservationOrder: false,
// 					AppealCase: {
// 						LPACode: 'LPA_001',
// 						appealTypeCode: 'S78'
// 					},
// 					SubmissionAddress: [
// 						{
// 							id: 'add_001',
// 							questionnaireId: '001',
// 							addressLine1: 'Somewhere',
// 							addressLine2: 'Somewhere St',
// 							townCity: 'Somewhereville',
// 							postcode: 'SOM3 W3R'
// 						}
// 					],
// 					SubmissionDocumentUpload: [
// 						{
// 							id: 'img_001',
// 							fileName: 'img.jpg',
// 							originalFileName: 'oimg.jpg',
// 							questionnaireId: '001',
// 							name: 'img.jpg',
// 							location: '/img.jpg',
// 							type: 'jpg'
// 						}
// 					]
// 				};
// 			default:
// 				return null;
// 		}
// 	}
// }));

// jest.mock('../../../../../../../src/configuration/featureFlag', () => ({
// 	isFeatureActive() {
// 		return true;
// 	}
// }));

// jest.mock('../../../../../../../src/infrastructure/event-client', () => ({
// 	sendEvents: jest.fn()
// }));

// jest.mock('../../../../../../../src/services/object-store');

// const formattedHAS1 = {
// 	LPACode: 'LPA_001',
// 	caseReference: '001',
// 	documents: [
// 		{
// 			dateCreated: '2024-03-01T13:48:35.847Z',
// 			documentType: undefined,
// 			documentURI: 'https://example.com',
// 			filename: 'img.jpg',
// 			lastModified: '2024-03-01T14:48:35.847Z',
// 			mime: 'image/jpeg',
// 			origin: 'citizen',
// 			originalFilename: 'oimg.jpg',
// 			size: 10293,
// 			sourceSystem: 'appeals',
// 			stage: 'lpa_questionnaire'
// 		}
// 	],
// 	questionnaire: {
// 		addAffectedListedBuilding: undefined,
// 		addNearbyAppeal: undefined,
// 		addNeighbouringSiteAccess: undefined,
// 		affectedListedBuildingNumber: NaN,
// 		affectsListedBuilding: true,
// 		conservationArea: true,
// 		correctAppealType: true,
// 		greenBelt: true,
// 		lpaSiteAccess: true,
// 		lpaSiteAccessDetails: undefined,
// 		lpaSiteSafety: true,
// 		lpaSiteSafetyDetails: "oh it's bad",
// 		lpaStatement: null,
// 		lpaStatementDocuments: null,
// 		nearbyAppealReference: '002',
// 		nearbyAppeals: undefined,
// 		'neighbouring-address': [
// 			{
// 				county: null,
// 				line1: 'Somewhere',
// 				line2: 'Somewhere St',
// 				postcode: 'SOM3 W3R',
// 				town: 'Somewhereville'
// 			}
// 		],
// 		neighbouringSiteAccess: true,
// 		neighbouringSiteAccessDetails: undefined,
// 		newConditionDetails: 'I have new conditions',
// 		newConditions: true,
// 		notificationMethod: [
// 			'A public notice at the site',
// 			'Letters to neighbours',
// 			'Advert in the local press'
// 		],
// 		otherPartyRepresentations: null
// 	}
// };

// describe('/api/v2/appeal-cases/:caseReference/submit', () => {
// 	it.each([
// 		['HAS', '001', formattedHAS1],
// 		['HAS', '002', formattedHAS2]
// 	])('Formats %s appeal submission then sends it to back office', async (_, id, expectation) => {
// 		await appealsApi
// 			.post(`/api/v2/appellant-submissions/${id}/submit`)
// 			.expect(200);

// 		expect(sendEvents).toHaveBeenCalledWith(
// 			'appeal-fo-lpa-response-submission',
// 			expectation,
// 			'Create'
// 		);
// 	});

// 	it('404s if the appeal submission can not be found', () => {
// 		appealsApi
// 			.post('/api/v2/appellant-submissions/003/submit')
// 			.expect(404)
// 			.end(() => {});
// 	});
// });
