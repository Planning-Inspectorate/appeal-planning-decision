const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const {
	constants: { DECISION_OUTCOME }
} = require('@pins/business-rules');

const lpaAppealIds = {
	appealOne: '756d6bfb-dde8-4532-a041-86c226a23b01',
	appealTwo: '756d6bfb-dde8-4532-a041-86c226a23b02',
	appealThree: '756d6bfb-dde8-4532-a041-86c226a23b03',
	appealFour: '756d6bfb-dde8-4532-a041-86c226a23b04',
	appealFive: '756d6bfb-dde8-4532-a041-86c226a23b05',
	appealSix: '756d6bfb-dde8-4532-a041-86c226a23b06',
	appealSeven: '756d6bfb-dde8-4532-a041-86c226a23b07',
	appealEight: '756d6bfb-dde8-4532-a041-86c226a23b08',
	appealNine: '756d6bfb-dde8-4532-a041-86c226a23b09',
	appealTen: '756d6bfb-dde8-4532-a041-86c226a23b10',
	appealEleven: '756d6bfb-dde8-4532-a041-86c226a23b11',
	appealTwelve: '756d6bfb-dde8-4532-a041-86c226a23b12',
	appealThirteen: '756d6bfb-dde8-4532-a041-86c226a23b13',
	appealFourteen: '756d6bfb-dde8-4532-a041-86c226a23b14',
	appealFifteen: '756d6bfb-dde8-4532-a041-86c226a23b15',
	appeal16: '756d6bfb-dde8-4532-a041-86c226a23b16'
};

/**
 * @type {import('@prisma/client').Prisma.AppealCreateInput[]}
 */
const lpaAppeals = [
	{ id: lpaAppealIds.appealOne },
	{ id: lpaAppealIds.appealTwo },
	{ id: lpaAppealIds.appealThree },
	{ id: lpaAppealIds.appealFour },
	{ id: lpaAppealIds.appealFive },
	{ id: lpaAppealIds.appealSix },
	{ id: lpaAppealIds.appealSeven },
	{ id: lpaAppealIds.appealEight },
	{ id: lpaAppealIds.appealNine },
	{ id: lpaAppealIds.appealTen },
	{ id: lpaAppealIds.appealEleven },
	{ id: lpaAppealIds.appealTwelve },
	{ id: lpaAppealIds.appealThirteen },
	{ id: lpaAppealIds.appealFourteen },
	{ id: lpaAppealIds.appealFifteen },
	{ id: lpaAppealIds.appeal16 }
];

const commonAppealCaseDataProperties = {
	LPACode: 'Q9999',
	LPAName: 'System Test Borough Council',
	decision: 'refused',
	originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
	costsAppliedForIndicator: false,
	LPAApplicationReference: '12/2323232/PLA',
	procedure: 'inquiry',
	appellantFirstName: 'Test',
	appellantLastName: 'Appellant',
	rule6StatementPublished: true,
	casePublished: true
};

/**
 * @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]}
 */
const lpaAppealCaseData = [
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealOne }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000000',
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		siteAddressLine1: 'New appeal',
		siteAddressLine2: null,
		siteAddressTown: 'No due dates',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN'
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal16 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000100',
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		siteAddressLine1: 'HAS Questionnaire and statement due',
		siteAddressLine2: null,
		siteAddressTown: 'Not submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTwo }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000001',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement due',
		siteAddressLine2: null,
		siteAddressTown: 'Not submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		ownsAllLand: true,
		agriculturalHolding: true,
		appellantSiteAccess: true,
		appellantSiteAccessDetails: 'Clear access',
		appellantSiteSafety: true,
		appellantSiteSafetyDetails: 'Cattle',
		appellantProcedurePreference: 'Hearing',
		appellantPreferHearingDetails: 'Would like day in court',
		updateDevelopmentDescription: true,
		developmentDescriptionDetails: 'a test development',
		statusPlanningObligation: 'a test planning status obligation'
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealThree }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000002',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire overdue',
		siteAddressLine2: null,
		siteAddressTown: null,
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		yourFirstName: 'Test',
		yourLastName: 'Agent',
		yourCompanyName: 'Test Agency Ltd',
		ownsSomeLand: true,
		agriculturalHolding: true,
		appellantSiteAccess: false,
		appellantSiteAccessDetails: 'Blocked access',
		appellantSiteSafety: false,
		appellantSiteSafetyDetails: 'No issues',
		appellantProcedurePreference: 'Inquiry',
		appellantPreferInquiryDetails: 'Would like longer consideration'
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFour }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000003',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		ownsSomeLand: true,
		knowsOtherOwners: true,
		identifiedOwners: true,
		advertisedAppeal: true,
		informedOwners: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		appellantSiteAccess: false,
		appellantSiteAccessDetails: 'Blocked access',
		appellantSiteSafety: false,
		appellantSiteSafetyDetails: 'No issues',
		appellantProcedurePreference: 'Inquiry',
		appellantPreferInquiryDetails: 'Would like longer consideration'
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFive }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000004',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: 'no comments or proofs',
		siteAddressTown: 'Statement overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealSix }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000005',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'no comments or proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealSeven }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000006',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealEight }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000007',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealNine }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000008',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		LPACommentsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantCommentsSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000009',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealEleven }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000010',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTwelve }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000011',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Proofs submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealThirteen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '1000012',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'Allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcome: DECISION_OUTCOME.ALLOWED,
		caseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFourteen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '1000013',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'dismissed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcome: DECISION_OUTCOME.DISMISSED,
		caseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFifteen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '1000014',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'split decision',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublished: true,
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcome: DECISION_OUTCOME.SPLIT_DECISION,
		caseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		// questionnaire details
		// constraints
		correctAppealType: true,
		changesListedBuilding: false,
		affectsListedBuilding: false,
		scheduledMonument: false,
		conservationArea: true,
		uploadConservation: true,
		protectedSpecies: false,
		greenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		uploadTreePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		uploadDefinitiveMapStatement: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'change-extensions',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		uploadWhoNotified: true,
		notificationMethod: 'site-notice letters-or-emails',
		uploadSiteNotice: true,
		uploadLettersEmails: true,
		uploadPressAdvert: true,
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		uploadRepresentations: true,
		// planning officer reports
		uploadPlanningOfficerReport: true,
		uploadDevelopmentPlanPolicies: true,
		emergingPlan: true,
		uploadEmergingPlan: true,
		uploadOtherPolicies: true,
		supplementaryPlanningDocs: true,
		uploadSupplementaryPlanningDocs: true,
		infrastructureLevy: true,
		uploadInfrastructureLevy: true,
		infrastructureLevyAdopted: true,
		infrastructureLevyAdoptedDate: new Date(Date.now()),
		// site access
		lpaSiteAccess: true,
		lpaSiteAccessDetails: 'Site materials',
		neighbouringSiteAccess: true,
		neighbouringSiteAccessDetails: 'Example text',
		addNeighbouringSiteAccess: true,
		lpaSiteSafetyRisks: true,
		lpaSiteSafetyRiskDetails: 'Example text',
		// appeal process
		lpaProcedurePreference: 'inquiry',
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		nearbyAppeals: true,
		newConditions: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
	}
];

module.exports = {
	lpaAppealCaseData,
	lpaAppeals
};
