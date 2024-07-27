const supertest = require('supertest');
const http = require('http');
const app = require('../../../../../../app');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');
const { markQuestionnaireAsSubmitted } = require('../service');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');

const server = http.createServer(app);
const appealsApi = supertest(server);

/**
 * @typedef {import('../../../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

jest.mock('../service', () => ({
	/**
	 * @param {string} caseReference
	 * @returns {Partial<LPAQuestionnaireSubmission> | null}
	 */
	getLPAQuestionnaireByAppealId: (caseReference) => {
		switch (caseReference) {
			case '001':
				return {
					correctAppealType: true,
					affectsListedBuilding: true,
					affectedListedBuildingNumber: '10101',
					conservationArea: true,
					greenBelt: true,
					otherPartyRepresentations: true,
					lpaSiteSafetyRisks: 'yes',
					lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails: "oh it's bad",
					lpaSiteAccess: 'yes',
					neighbourSiteAccess: 'yes',
					newConditions: 'yes',
					newConditions_newConditionDetails: 'I have new conditions',
					notificationMethod: 'site-notice,letters-or-emails,advert',
					AppealCase: {
						LPACode: 'LPA_001',
						appealTypeCode: 'HAS'
					},
					SubmissionAddress: [
						{
							id: 'add_001',
							questionnaireId: '001',
							appellantSubmissionId: null,
							fieldName: 'neighbourSiteAddress',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							county: null
						}
					],
					SubmissionListedBuilding: [
						{
							id: 'list_001',
							lPAQuestionnaireSubmissionId: '001',
							appellantSubmissionId: null,
							fieldName: 'affectedListedBuildingNumber',
							reference: '1010101',
							listedBuildingGrade: 'I',
							name: 'very special building'
						}
					],
					SubmissionDocumentUpload: [
						{
							id: 'img_001',
							questionnaireId: '001',
							appellantSubmissionId: null,
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							storageId: 'img_001'
						}
					],
					SubmissionLinkedCase: [
						{
							id: 'link_001',
							lPAQuestionnaireSubmissionId: '001',
							appellantSubmissionId: null,
							fieldName: 'nearbyAppealReference',
							appealCaseId: null,
							caseReference: 'abc1234'
						}
					]
				};
			case '002':
				return {
					addChangedListedBuilding: true,
					areaOutstandingBeauty: true,
					changesListedBuilding: true,
					changedListedBuildingNumber: '010101',
					columnTwoThreshold: true,
					environmentalStatement: true,
					consultationResponses: true,
					statutoryConsultees_consultedBodiesDetails: 'consultation details',
					designatedSites: 'yes',
					developmentDescription: '',
					emergingPlan: true,
					environmentalImpactSchedule: '',
					gypsyTraveller: true,
					infrastructureLevy: false,
					infrastructureLevyAdopted: false,
					infrastructureLevyAdoptedDate: null,
					infrastructureLevyExpectedDate: null,
					lpaPreferHearingDetails: 'Hearing details',
					lpaPreferInquiryDetails: 'Inquiry details',
					lpaProcedurePreference_lpaPreferInquiryDuration: 'Very long',
					lpaProcedurePreference: 'Hearing',
					designatedSites_otherDesignations: 'other designations',
					protectedSpecies: false,
					publicRightOfWay: true,
					affectsScheduledMonument: true,
					screeningOpinion: false,
					sensitiveArea: 'yes',
					sensitiveArea_sensitiveAreaDetails: 'Sensitive area details',
					statutoryConsultees: 'Mrs Consultee',
					supplementaryPlanningDocs: true,
					treePreservationOrder: false,
					AppealCase: {
						LPACode: 'LPA_001',
						appealTypeCode: 'S78'
					},
					SubmissionAddress: [
						{
							id: 'add_001',
							questionnaireId: '001',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							fieldName: 'neighbourSiteAddress',
							county: null,
							appellantSubmissionId: null
						}
					],
					SubmissionDocumentUpload: [
						{
							id: 'img_001',
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							questionnaireId: '001',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							appellantSubmissionId: null,
							storageId: 'img_001'
						}
					]
				};
			default:
				return null;
		}
	},
	markQuestionnaireAsSubmitted: jest.fn()
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
			metadata: {
				mime_type: 'image/jpeg',
				size: 10293,
				document_type: 'planningOfficersReportUpload'
			},
			_response: { request: { url: 'https://example.com' } }
		});
	}
}));

const formattedHAS = [
	expect.objectContaining({
		casedata: {
			caseReference: '001',
			lpaQuestionnaireSubmittedDate: expect.any(String),
			isCorrectAppealType: true,
			affectedListedBuildingNumbers: ['1010101'],
			inConservationArea: true,
			isGreenBelt: true,
			notificationMethod: [
				LPA_NOTIFICATION_METHODS.notice.key,
				LPA_NOTIFICATION_METHODS.letter.key,
				LPA_NOTIFICATION_METHODS.pressAdvert.key
			],
			siteAccessDetails: null,
			siteSafetyDetails: ["oh it's bad"],
			neighbouringSiteAddresses: [
				{
					neighbouringSiteAddressLine1: 'Somewhere',
					neighbouringSiteAddressLine2: 'Somewhere St',
					neighbouringSiteAddressTown: 'Somewhereville',
					neighbouringSiteAddressCounty: null,
					neighbouringSiteAddressPostcode: 'SOM3 W3R',
					neighbouringSiteAccessDetails: null,
					neighbouringSiteSafetyDetails: null
				}
			],
			nearbyCaseReferences: ['abc1234'],
			newConditionDetails: 'I have new conditions',
			lpaStatement: '',
			lpaCostsAppliedFor: null
		},
		documents: [
			{
				documentId: 'img_001',
				dateCreated: '2024-03-01T13:48:35.847Z',
				documentType: 'planningOfficerReport',
				documentURI: 'https://example.com',
				filename: 'img.jpg',
				mime: 'image/jpeg',
				originalFilename: 'oimg.jpg',
				size: 10293
			}
		]
	})
];

// const formattedS78 = {
// 	LPACode: 'LPA_001',
// 	caseReference: '002',
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
// 		addChangedListedBuilding: true,
// 		areaOutstandingBeauty: true,
// 		changedListedBuildingNumber: 10101,
// 		changesListedBuilding: true,
// 		columnTwoThreshold: true,
// 		completedEnvironmentalStatement: true,
// 		consultationResponses: true,
// 		consultedBodiesDetails: 'consultation details',
// 		designatedSites: 'yes',
// 		developmentDescription: '',
// 		emergingPlan: true,
// 		environmentalImpactSchedule: '',
// 		gypsyTraveller: true,
// 		infrastructureLevy: false,
// 		infrastructureLevyAdopted: false,
// 		infrastructureLevyAdoptedDate: null,
// 		infrastructureLevyExpectedDate: null,
// 		lpaFinalComment: null,
// 		lpaFinalCommentDetails: null,
// 		lpaPreferHearingDetails: 'Hearing details',
// 		lpaPreferInquiryDetails: 'Inquiry details',
// 		lpaPreferInquiryDuration: 'Very long',
// 		lpaProcedurePreference: 'Hearing',
// 		lpaWitnesses: null,
// 		otherDesignationDetails: 'other designations',
// 		protectedSpecies: false,
// 		publicRightOfWay: true,
// 		requiresEnvironmentalStatement: true,
// 		scheduledMonument: true,
// 		screeningOpinion: false,
// 		sensitiveArea: true,
// 		sensitiveAreaDetails: 'Sensitive area details',
// 		statutoryConsultees: false,
// 		supplementaryPlanningDocs: true,
// 		treePreservationOrder: false
// 	}
// };

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	beforeAll(async () => {
		// Give the schemas a moment to load from disk
		await new Promise((res) => {
			setTimeout(res, 2000);
		});
	});
	it.each([
		['HAS', '001', formattedHAS]
		// ['S78', '002', formattedS78]
	])('Formats %s questionnaires then sends it to back office', async (_, id, expectation) => {
		await appealsApi
			.post(`/api/v2/appeal-cases/${id}/lpa-questionnaire-submission/submit`)
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-lpa-response-submission',
			expectation,
			'Create'
		);

		expect(markQuestionnaireAsSubmitted).toHaveBeenCalled();
	});

	it('404s if the questionnaire can not be found', () => {
		appealsApi
			.post('/api/v2/appeal-cases/003/lpa-questionnaire-submission/submit')
			.expect(404)
			.end(() => {});
	});
});
