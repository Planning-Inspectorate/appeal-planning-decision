const supertest = require('supertest');
const app = require('../../../../../../app');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');
const { markQuestionnaireAsSubmitted } = require('../service');
const { LPA_NOTIFICATION_METHODS, CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const config = require('../../../../../../../src/configuration/config');

const appealsApi = supertest(app);

/**
 * @typedef {import('../../../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

jest.mock('../../../service', () => ({
	getCaseAndAppellant: jest.fn((params) => {
		switch (params.caseReference) {
			case '001':
				return {
					id: 'appeal-001',
					appealTypeCode: 'HAS',
					LPACode: 'LPA_001',
					caseReference: '001',
					applicationReference: 'APP/001',
					caseStartedDate: new Date(),
					users: [
						{
							serviceUserType: 'Appellant',
							emailAddress: 'test@example.com'
						}
					],
					siteAddressLine1: '123 Test Road',
					siteAddressTown: 'Testville',
					siteAddressPostcode: 'T35 T1N'
				};
			case '002':
				return {
					id: 'appeal-002',
					appealTypeCode: 'S78',
					LPACode: 'LPA_001',
					caseReference: '002',
					applicationReference: 'APP/002',
					caseStartedDate: new Date(),
					users: [
						{
							serviceUserType: 'Appellant',
							emailAddress: 's78@example.com'
						}
					],
					siteAddressLine1: '456 Another Rd',
					siteAddressTown: 'Townsville',
					siteAddressPostcode: 'S78 1AB'
				};
			case '003':
				return {
					id: 'appeal-003',
					appealTypeCode: 'S20',
					LPACode: 'LPA_001',
					caseReference: '003',
					applicationReference: 'APP/003',
					caseStartedDate: new Date(),
					users: [
						{
							serviceUserType: 'Appellant',
							emailAddress: 's20@example.com'
						}
					],
					siteAddressLine1: '456 Another Rd',
					siteAddressTown: 'Townsville',
					siteAddressPostcode: 'S78 1AB'
				};
			default:
				return null;
		}
	})
}));

jest.mock('../../../../../../services/lpa.service', () => {
	return jest.fn(() => ({
		getLpaByCode: jest.fn().mockResolvedValue({
			getEmail: jest.fn(() => 'test@example.com'),
			getName: jest.fn(() => 'lpaName')
		}),
		getLpaById: jest.fn().mockResolvedValue({
			getEmail: jest.fn(() => 'test@example.com'),
			getName: jest.fn(() => 'lpaName')
		})
	}));
});

const mockNotifyClient = {
	sendEmail: jest.fn()
};

jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
	return {
		getNotifyClient: () => mockNotifyClient
	};
});

const hasCase = {
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
	neighbourSiteAccess_neighbourSiteAccessDetails: 'check the impact',
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

jest.mock('../service', () => ({
	/**
	 * @param {string} caseReference
	 * @returns {Partial<LPAQuestionnaireSubmission> | null}
	 */
	getLPAQuestionnaireByAppealId: (caseReference) => {
		switch (caseReference) {
			case '001':
				return hasCase;
			case '002':
				return {
					...hasCase,
					AppealCase: {
						LPACode: 'LPA_001',
						appealTypeCode: 'S78'
					},
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
					lpaProcedurePreference_lpaPreferInquiryDuration: '12',
					lpaProcedurePreference: 'hearing',
					designatedSites_otherDesignations: 'other designations',
					protectedSpecies: false,
					publicRightOfWay: true,
					affectsScheduledMonument: true,
					screeningOpinion: false,
					sensitiveArea: 'yes',
					sensitiveArea_sensitiveAreaDetails: 'Sensitive area details',
					statutoryConsultees: 'Mrs Consultee',
					supplementaryPlanningDocs: true,
					treePreservationOrder: false
				};
			case '003':
				return {
					...hasCase,
					AppealCase: {
						LPACode: 'LPA_001',
						appealTypeCode: 'S20'
					},
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
					section3aGrant: true,
					consultHistoricEngland: true,
					infrastructureLevy: false,
					infrastructureLevyAdopted: false,
					infrastructureLevyAdoptedDate: null,
					infrastructureLevyExpectedDate: null,
					lpaPreferHearingDetails: 'Hearing details',
					lpaPreferInquiryDetails: 'Inquiry details',
					lpaProcedurePreference_lpaPreferInquiryDuration: '12',
					lpaProcedurePreference: 'hearing',
					designatedSites_otherDesignations: 'other designations',
					protectedSpecies: false,
					publicRightOfWay: true,
					affectsScheduledMonument: true,
					screeningOpinion: false,
					sensitiveArea: 'yes',
					sensitiveArea_sensitiveAreaDetails: 'Sensitive area details',
					statutoryConsultees: 'Mrs Consultee',
					supplementaryPlanningDocs: true,
					treePreservationOrder: false
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

const expectedHAS = {
	casedata: {
		caseType: CASE_TYPES.HAS.key,
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
		reasonForNeighbourVisits: 'check the impact',
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
};

const formattedHAS = [expect.objectContaining(expectedHAS)];

const formattedS78 = [
	expect.objectContaining({
		casedata: {
			...expectedHAS.casedata,

			caseType: CASE_TYPES.S78.key,
			caseReference: '002',

			lpaProcedurePreference: APPEAL_CASE_PROCEDURE.HEARING,
			affectsScheduledMonument: true,
			changedListedBuildingNumbers: [],
			designatedSitesNames: ['yes', 'other designations'],
			eiaColumnTwoThreshold: true,
			eiaCompletedEnvironmentalStatement: false,
			consultedBodiesDetails: 'consultation details',
			eiaDevelopmentDescription: null,
			eiaEnvironmentalImpactSchedule: null,
			eiaRequiresEnvironmentalStatement: true,
			eiaScreeningOpinion: false,
			eiaSensitiveAreaDetails: 'Sensitive area details',
			hasConsultationResponses: true,
			hasEmergingPlan: true,
			hasInfrastructureLevy: false,
			hasProtectedSpecies: false,
			hasStatutoryConsultees: false,
			hasSupplementaryPlanningDocs: true,
			hasTreePreservationOrder: false,
			infrastructureLevyAdoptedDate: null,
			infrastructureLevyExpectedDate: null,
			isAonbNationalLandscape: true,
			isGypsyOrTravellerSite: true,
			isInfrastructureLevyFormallyAdopted: null,
			isPublicRightOfWay: true,
			lpaProcedurePreferenceDetails: 'Hearing details',
			lpaProcedurePreferenceDuration: null,
			lpaQuestionnaireSubmittedDate: expect.any(String)
		},
		documents: [...expectedHAS.documents]
	})
];
const formattedS20 = [
	expect.objectContaining({
		casedata: {
			...expectedHAS.casedata,

			caseType: CASE_TYPES.S20.key,
			caseReference: '003',

			lpaProcedurePreference: APPEAL_CASE_PROCEDURE.HEARING,
			affectsScheduledMonument: true,
			changedListedBuildingNumbers: [],
			designatedSitesNames: ['yes', 'other designations'],
			preserveGrantLoan: true,
			consultHistoricEngland: true,
			eiaColumnTwoThreshold: true,
			eiaCompletedEnvironmentalStatement: false,
			consultedBodiesDetails: 'consultation details',
			eiaDevelopmentDescription: null,
			eiaEnvironmentalImpactSchedule: null,
			eiaRequiresEnvironmentalStatement: true,
			eiaScreeningOpinion: false,
			eiaSensitiveAreaDetails: 'Sensitive area details',
			hasConsultationResponses: true,
			hasEmergingPlan: true,
			hasInfrastructureLevy: false,
			hasProtectedSpecies: false,
			hasStatutoryConsultees: false,
			hasSupplementaryPlanningDocs: true,
			hasTreePreservationOrder: false,
			infrastructureLevyAdoptedDate: null,
			infrastructureLevyExpectedDate: null,
			isAonbNationalLandscape: true,
			isGypsyOrTravellerSite: true,
			isInfrastructureLevyFormallyAdopted: null,
			isPublicRightOfWay: true,
			lpaProcedurePreferenceDetails: 'Hearing details',
			lpaProcedurePreferenceDuration: null,
			lpaQuestionnaireSubmittedDate: expect.any(String)
		},
		documents: [...expectedHAS.documents]
	})
];

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	const expectEmail = (email, appealReferenceNumber) => {
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
			config.services.notify.templates.generic,
			email,
			{
				personalisation: {
					subject: `We've received your questionnaire: ${appealReferenceNumber}`,
					content: expect.stringContaining(`We have received your questionnaire`)
				},
				reference: expect.any(String),
				emailReplyToId: undefined
			}
		);
	};
	beforeAll(async () => {});
	it.each([
		['HAS', '001', formattedHAS],
		['S78', '002', formattedS78],
		['S20', '003', formattedS20]
	])('Formats %s questionnaires then sends it to back office', async (_, id, expectation) => {
		mockNotifyClient.sendEmail.mockClear();

		await appealsApi
			.post(`/api/v2/appeal-cases/${id}/lpa-questionnaire-submission/submit`)
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-lpa-response-submission',
			expectation,
			'Create'
		);

		expect(markQuestionnaireAsSubmitted).toHaveBeenCalled();
		expectEmail('test@example.com', id);
	});

	it('404s if the questionnaire can not be found', () => {
		appealsApi
			.post('/api/v2/appeal-cases/nope/lpa-questionnaire-submission/submit')
			.expect(404)
			.end(() => {});
	});
});
