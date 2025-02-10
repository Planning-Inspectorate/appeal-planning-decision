const { formatter } = require(`./questionnaire`);
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const S78 = CASE_TYPES.S78.key;
const { APPEAL_LPA_PROCEDURE_PREFERENCE } = require('pins-data-model');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('formatter', () => {
	const caseReference = '12345';
	const answers = {
		correctAppealType: true,
		SubmissionListedBuilding: [{ reference: 'LB123', fieldName: 'affectedListedBuildingNumber' }],
		conservationArea: true,
		greenBelt: false,
		notificationMethod: 'site-notice,letters-or-emails,advert',
		lpaSiteAccess_lpaSiteAccessDetails: 'Access details',
		lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails: 'Safety details',
		SubmissionAddress: [
			{
				fieldName: 'neighbourSiteAddress',
				addressLine1: 'Line 1',
				addressLine2: 'Line 2',
				townCity: 'Town',
				county: 'County',
				postcode: 'Postcode'
			}
		],
		SubmissionLinkedCase: [{ caseReference: 'CASE123' }],
		newConditions_newConditionDetails: 'New condition details',
		lpaProcedurePreference: 'written'
	};
	const s78Answers = {
		...answers,
		// Constraints, designations and other issues
		SubmissionListedBuilding: [
			...answers.SubmissionListedBuilding,
			{ reference: 'LB456', fieldName: 'changedListedBuildingNumber' }
		],
		affectsScheduledMonument: true,
		protectedSpecies: true,
		areaOutstandingBeauty: true,
		designatedSites: 'a,b',
		designatedSites_otherDesignations: 'other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,

		environmentalImpactSchedule: 'hello',
		developmentDescription: 'eiaDevelopmentDescription',
		sensitiveArea_sensitiveAreaDetails: 'sensitiveArea_sensitiveAreaDetails',
		columnTwoThreshold: true,
		screeningOpinion: true,
		environmentalStatement: true,
		applicantSubmittedEnvironmentalStatement: 'yes',
		statutoryConsultees: 'yes',
		statutoryConsultees_consultedBodiesDetails: 'statutoryConsultees_consultedBodiesDetails',
		consultationResponses: true,
		emergingPlan: true,
		supplementaryPlanningDocs: true,

		infrastructureLevy: true,
		infrastructureLevyAdopted: true,
		infrastructureLevyAdoptedDate: new Date(),
		infrastructureLevyExpectedDate: new Date(),

		// Appeal process
		lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.INQUIRY,
		lpaPreferInquiryDetails: 'lpaPreferInquiryDetails',
		lpaProcedurePreference_lpaPreferInquiryDuration: '12'
	};

	const formattedAnswers = {
		casedata: {
			caseType: S78,
			caseReference: '12345',
			lpaQuestionnaireSubmittedDate: expect.any(String),
			isCorrectAppealType: true,
			affectedListedBuildingNumbers: ['LB123'],
			inConservationArea: true,
			isGreenBelt: false,
			notificationMethod: ['notice', 'letter', 'advert'],
			siteAccessDetails: ['Access details'],
			siteSafetyDetails: ['Safety details'],
			neighbouringSiteAddresses: [
				{
					neighbouringSiteAddressLine1: 'Line 1',
					neighbouringSiteAddressLine2: 'Line 2',
					neighbouringSiteAddressTown: 'Town',
					neighbouringSiteAddressCounty: 'County',
					neighbouringSiteAddressPostcode: 'Postcode',
					neighbouringSiteAccessDetails: null,
					neighbouringSiteSafetyDetails: null
				}
			],
			nearbyCaseReferences: ['CASE123'],
			newConditionDetails: 'New condition details',
			lpaStatement: '',

			// s78
			affectsScheduledMonument: undefined,
			lpaCostsAppliedFor: null,
			changedListedBuildingNumbers: [],
			designatedSitesNames: [],
			eiaColumnTwoThreshold: undefined,
			eiaCompletedEnvironmentalStatement: false,
			eiaConsultedBodiesDetails: null,
			eiaDevelopmentDescription: null,
			eiaEnvironmentalImpactSchedule: null,
			eiaRequiresEnvironmentalStatement: undefined,
			eiaScreeningOpinion: undefined,
			eiaSensitiveAreaDetails: null,
			hasConsultationResponses: undefined,
			hasEmergingPlan: undefined,
			hasInfrastructureLevy: false,
			hasProtectedSpecies: undefined,
			hasStatutoryConsultees: false,
			hasSupplementaryPlanningDocs: undefined,
			hasTreePreservationOrder: undefined,
			infrastructureLevyAdoptedDate: null,
			infrastructureLevyExpectedDate: null,
			isAonbNationalLandscape: undefined,
			isGypsyOrTravellerSite: undefined,
			isInfrastructureLevyFormallyAdopted: null,
			isPublicRightOfWay: undefined,
			lpaProcedurePreference: 'written',
			lpaProcedurePreferenceDetails: null,
			lpaProcedurePreferenceDuration: null
		},
		documents: [1]
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the HAS data correctly', async () => {
		const result = await formatter(caseReference, answers);

		expect(result).toEqual(formattedAnswers);
	});

	it('should format the S78 data correctly', async () => {
		const result = await formatter(caseReference, s78Answers);

		expect(result).toEqual({
			casedata: {
				...formattedAnswers.casedata,

				// s78
				changedListedBuildingNumbers: ['LB456'],
				affectsScheduledMonument: s78Answers.affectsScheduledMonument,
				hasProtectedSpecies: s78Answers.protectedSpecies,
				isAonbNationalLandscape: s78Answers.areaOutstandingBeauty,
				designatedSitesNames: ['a', 'b', 'other'],
				hasTreePreservationOrder: s78Answers.treePreservationOrder,
				isGypsyOrTravellerSite: s78Answers.gypsyTraveller,
				isPublicRightOfWay: s78Answers.publicRightOfWay,

				// Environmental impact assessment
				eiaEnvironmentalImpactSchedule: s78Answers.environmentalImpactSchedule,
				eiaDevelopmentDescription: s78Answers.developmentDescription,
				eiaSensitiveAreaDetails: s78Answers.sensitiveArea_sensitiveAreaDetails,
				eiaColumnTwoThreshold: s78Answers.columnTwoThreshold,
				eiaScreeningOpinion: s78Answers.screeningOpinion,
				eiaRequiresEnvironmentalStatement: s78Answers.environmentalStatement,
				eiaCompletedEnvironmentalStatement: true,

				// Consultation responses and representations
				hasStatutoryConsultees: true,
				eiaConsultedBodiesDetails: s78Answers.statutoryConsultees_consultedBodiesDetails,
				hasConsultationResponses: s78Answers.consultationResponses,

				// Planning officer’s report and supporting documents
				hasEmergingPlan: s78Answers.emergingPlan,
				hasSupplementaryPlanningDocs: s78Answers.supplementaryPlanningDocs,

				// levy
				hasInfrastructureLevy: s78Answers.infrastructureLevy,
				isInfrastructureLevyFormallyAdopted: s78Answers.infrastructureLevyAdopted,
				infrastructureLevyAdoptedDate: s78Answers.infrastructureLevyAdoptedDate.toISOString(),
				infrastructureLevyExpectedDate: null,

				// preference
				lpaProcedurePreference: s78Answers.lpaProcedurePreference,
				lpaProcedurePreferenceDetails: s78Answers.lpaPreferInquiryDetails,
				lpaProcedurePreferenceDuration: Number(
					s78Answers.lpaProcedurePreference_lpaPreferInquiryDuration
				)
			},
			documents: [1]
		});
	});

	it('should format hearing preference correctly', async () => {
		const result = await formatter(caseReference, {
			...s78Answers,
			lpaProcedurePreference: 'hearing',
			lpaPreferHearingDetails: 'hearing details'
		});

		expect(result.casedata.lpaProcedurePreference).toEqual('hearing');
		expect(result.casedata.lpaProcedurePreferenceDetails).toEqual('hearing details');
		expect(result.casedata.lpaProcedurePreferenceDuration).toEqual(null);
	});

	it('should format written preference correctly', async () => {
		const result = await formatter(caseReference, {
			...s78Answers,
			lpaProcedurePreference: 'written',
			lpaPreferHearingDetails: 'hearing details'
		});

		expect(result.casedata.lpaProcedurePreference).toEqual('written');
		expect(result.casedata.lpaProcedurePreferenceDetails).toEqual(null);
		expect(result.casedata.lpaProcedurePreferenceDuration).toEqual(null);
	});

	it('should format no levy correctly', async () => {
		const result = await formatter(caseReference, {
			...s78Answers,
			infrastructureLevy: false
		});

		expect(result.casedata.hasInfrastructureLevy).toEqual(false);
		expect(result.casedata.isInfrastructureLevyFormallyAdopted).toEqual(null);
		expect(result.casedata.infrastructureLevyAdoptedDate).toEqual(null);
		expect(result.casedata.infrastructureLevyExpectedDate).toEqual(null);
	});

	it('should format levy expected correctly', async () => {
		const result = await formatter(caseReference, {
			...s78Answers,
			infrastructureLevyAdopted: false
		});

		expect(result.casedata.hasInfrastructureLevy).toEqual(true);
		expect(result.casedata.isInfrastructureLevyFormallyAdopted).toEqual(false);
		expect(result.casedata.infrastructureLevyAdoptedDate).toEqual(null);
		expect(result.casedata.infrastructureLevyExpectedDate).toEqual(
			s78Answers.infrastructureLevyExpectedDate.toISOString()
		);
	});

	it('should handle missing optional fields', async () => {
		const minimalAnswers = {
			correctAppealType: true,
			lpaProcedurePreference: 'written'
		};
		const result = await formatter(caseReference, minimalAnswers);

		expect(result).toEqual({
			casedata: {
				caseType: S78,
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: [],
				inConservationArea: undefined,
				isGreenBelt: undefined,
				notificationMethod: null,
				siteAccessDetails: null,
				siteSafetyDetails: null,
				neighbouringSiteAddresses: undefined,
				nearbyCaseReferences: undefined,
				newConditionDetails: null,
				lpaStatement: '',
				lpaCostsAppliedFor: null,

				// s78
				changedListedBuildingNumbers: [],
				affectsScheduledMonument: undefined,
				hasProtectedSpecies: undefined,
				isAonbNationalLandscape: undefined,
				designatedSitesNames: [],
				hasTreePreservationOrder: undefined,
				isGypsyOrTravellerSite: undefined,
				isPublicRightOfWay: undefined,

				// Environmental impact assessment
				eiaEnvironmentalImpactSchedule: null,
				eiaDevelopmentDescription: null,
				eiaSensitiveAreaDetails: null,
				eiaColumnTwoThreshold: undefined,
				eiaScreeningOpinion: undefined,
				eiaRequiresEnvironmentalStatement: undefined,
				eiaCompletedEnvironmentalStatement: false,

				// Consultation responses and representations
				hasStatutoryConsultees: false,
				eiaConsultedBodiesDetails: null,
				hasConsultationResponses: undefined,

				// Planning officer’s report and supporting documents
				hasEmergingPlan: undefined,
				hasSupplementaryPlanningDocs: undefined,

				// levy
				hasInfrastructureLevy: false,
				isInfrastructureLevyFormallyAdopted: null,
				infrastructureLevyAdoptedDate: null,
				infrastructureLevyExpectedDate: null,

				// preference
				lpaProcedurePreference: 'written',
				lpaProcedurePreferenceDetails: null,
				lpaProcedurePreferenceDuration: null
			},
			documents: [1]
		});
	});
});
