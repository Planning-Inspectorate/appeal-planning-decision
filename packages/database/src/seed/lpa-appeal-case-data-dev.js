const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_PROCEDURE
} = require('pins-data-model');

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
	appeal16: '756d6bfb-dde8-4532-a041-86c226a23b16',
	appeal17: '7c8322e0-c724-4969-b7d4-441c60c6847b',
	appeal18: '7c8322e0-c724-4969-b7d4-441c60c6848b',
	appeal19: '7c8322e0-c724-4969-b7d4-441c60c6849b',
	appeal20: '7c8312e0-c724-4969-b7d4-441c60c6841b',
	appeal21: '7c8312e0-c724-4969-b7d4-441c60c6842b',
	appeal22: '7c8312e0-c724-4969-b7d4-441c60c6843b',
	appeal23: '7c8312e0-c724-4969-b7d4-441c60c6844b',
	appeal24: '7c8312e0-c724-4969-b7d4-441c60c6845b',
	appeal25: '7c8312e0-c724-4969-b7d4-441c60c6846b',
	appeal26: 'e1ddcd1f-9e5a-4524-bc66-9fde4d68e8c8',
	appeal27: 'ec17a1da-e35d-4d35-acf8-0820fbc0a5e2',
	appeal28: '0ade191c-7171-417f-aa66-61b5c23b1ac3',
	appeal75: '7b8312e0-c724-4969-b7d4-441c60c6741b',
	appealTP1: '7c8412e0-c734-4969-b7d4-441c60c6840b',
	appealTP2: '7c8412e0-c734-4969-b7d4-441c60c6841b'
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
	{ id: lpaAppealIds.appeal16 },
	{ id: lpaAppealIds.appeal17 },
	{ id: lpaAppealIds.appeal18 },
	{ id: lpaAppealIds.appeal19 },
	{ id: lpaAppealIds.appeal20 },
	{ id: lpaAppealIds.appeal21 },
	{ id: lpaAppealIds.appeal22 },
	{ id: lpaAppealIds.appeal23 },
	{ id: lpaAppealIds.appeal24 },
	{ id: lpaAppealIds.appeal25 },
	{ id: lpaAppealIds.appeal26 },
	{ id: lpaAppealIds.appeal27 },
	{ id: lpaAppealIds.appeal28 },
	{ id: lpaAppealIds.appeal75 },
	{ id: lpaAppealIds.appealTP1 },
	{ id: lpaAppealIds.appealTP2 }
];

const commonAppealCaseDataProperties = {
	LPACode: 'Q1111',
	applicationDecision: 'refused',
	applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
	applicationDate: pickRandom(datesNMonthsAgo(2)),
	appellantCostsAppliedFor: false,
	applicationReference: '12/2323232/PLA',
	siteAreaSquareMetres: 22,
	rule6StatementPublished: true,
	casePublishedDate: new Date(),
	CaseStatus: {
		connect: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE }
	},
	caseSubmittedDate: pickRandom(datesNMonthsAgo(3)),
	caseCreatedDate: pickRandom(datesNMonthsAgo(3))
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
		siteAddressLine1: 'New appeal',
		siteAddressLine2: null,
		siteAddressTown: 'No due dates',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.HEARING } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.VALIDATION }
		},
		CaseType: { connect: { processCode: 'HAS' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal16 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000100',
		siteAddressLine1: 'HAS Questionnaire and statement due',
		siteAddressLine2: null,
		siteAddressTown: 'Not submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.HEARING } },
		CaseType: { connect: { processCode: 'HAS' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTwo }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000001',
		siteAddressLine1: 'Questionnaire and statement due',
		siteAddressLine2: null,
		siteAddressTown: 'Not submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		isGreenBelt: true,
		ownsAllLand: true,
		agriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Clear access']),
		siteSafetyDetails: JSON.stringify(['Cattle']),
		changedDevelopmentDescription: true,
		newConditionDetails: 'a test development',
		statusPlanningObligation: 'a test planning status obligation',
		caseWithdrawnDate: pickRandom(datesNMonthsAgo(1)),
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.WITHDRAWN }
		},
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.HEARING } },
		CaseType: { connect: { processCode: 'S78' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealThree }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000002',
		siteAddressLine1: 'Questionnaire overdue',
		siteAddressLine2: null,
		siteAddressTown: '',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: false,
		ownsSomeLand: true,
		agriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: JSON.stringify(['No issues']),
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFour }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000003',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		rule6StatementDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: true,
		ownsSomeLand: true,
		knowsOtherOwners: 'yes',
		advertisedAppeal: true,
		ownersInformed: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: JSON.stringify(['No issues']),
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFive }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000004',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		appellantCostsAppliedFor: false,
		applicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: 'no comments or proofs',
		siteAddressTown: 'Statement overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		isGreenBelt: true,
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealSix }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000005',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'no comments or proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		isGreenBelt: true,
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseType: { connect: { processCode: 'HAS' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.ISSUE_DETERMINATION }
		},
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealSeven }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000006',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		appellantFinalCommentsSubmitted: false,
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.WITHDRAWN }
		},
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealEight }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000007',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealNine }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000008',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		LPACommentsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantCommentsSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.ISSUE_DETERMINATION }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000009',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		caseWithdrawnDate: pickRandom(datesNMonthsAgo(1)),
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.WITHDRAWN }
		},
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealEleven }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000010',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.EVIDENCE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTwelve }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000011',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Proofs submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.ISSUE_DETERMINATION }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealThirteen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '1000012',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'Allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: new Date(),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED }
		},
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(1)),
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		conservationArea: true,
		protectedSpecies: false,
		isGreenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		AppealCaseLpaNotificationMethod: {
			create: {
				lPANotificationMethodsKey: 'notice'
			}
		},
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		// planning officer reports
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
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
		lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		changedDevelopmentDescription: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyCommentsPublished: true,
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFourteen }
		},
		...commonAppealCaseDataProperties,
		caseReference: '1000013',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'dismissed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED }
		},
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTP1 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '8087801',
		siteAddressLine1: 'Invalid',
		siteAddressLine2: null,
		siteAddressTown: 'within 28 days',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.INVALID }
		},
		caseDecisionPublishedDate: new Date(),
		caseDecisionOutcomeDate: new Date(),
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.INVALID }
		},
		caseValidationDate: new Date(),
		caseSubmittedDate: new Date()
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealTP2 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '8087802',
		siteAddressLine1: 'Invalid',
		siteAddressLine2: null,
		siteAddressTown: 'more than 28 days',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.INVALID }
		},
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(2)),
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.INVALID }
		},
		caseValidationDate: pickRandom(datesNMonthsAgo(2)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal17 }
		},
		LPACode: 'Q9999',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationDate: pickRandom(datesNMonthsAgo(2)),
		appellantCostsAppliedFor: false,
		applicationReference: '12/2323232/PLA',
		siteAreaSquareMetres: 22,
		rule6StatementPublished: true,
		casePublishedDate: new Date(),
		caseReference: '1000015',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: true,
		ownsSomeLand: true,
		knowsOtherOwners: 'Yes',
		advertisedAppeal: true,
		ownersInformed: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: null,
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'HAS' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal18 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000099',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		rule6StatementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		LPACommentsSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAhead(1)),
		rule6ProofEvidenceDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.EVIDENCE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal19 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000066',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal20 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000033',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: true,
		ownsSomeLand: true,
		knowsOtherOwners: 'yes',
		advertisedAppeal: true,
		ownersInformed: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: JSON.stringify(['No issues']),
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal21 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000333',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: true,
		ownsSomeLand: true,
		knowsOtherOwners: 'yes',
		advertisedAppeal: true,
		ownersInformed: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: JSON.stringify(['No issues']),
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal22 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0003333',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAhead(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		developmentDescription: 'test description',
		isGreenBelt: true,
		ownsSomeLand: true,
		knowsOtherOwners: 'yes',
		advertisedAppeal: true,
		ownersInformed: true,
		agriculturalHolding: true,
		tenantAgriculturalHolding: true,
		otherTenantsAgriculturalHolding: true,
		informedTenantsAgriculturalHolding: true,
		siteAccessDetails: JSON.stringify(['Blocked access']),
		siteSafetyDetails: JSON.stringify(['No issues']),
		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		appellantProcedurePreferenceDetails: 'Would like longer consideration',
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal23 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0000666',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal24 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0006666',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal25 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '0066666',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal75 }
		},
		...commonAppealCaseDataProperties,
		caseReference: '6666666',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		developmentDescription: 'test description',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal26 }
		},
		LPACode: 'Q1111',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		appellantCostsAppliedFor: true,
		applicationReference: '12/2323232/PLA',
		rule6StatementPublished: true,
		casePublishedDate: new Date(),
		caseReference: '1212123',
		siteAddressLine1: 'Decided',
		siteAddressLine2: '5 year withdraw test',
		siteAddressTown: 'split decision',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseValidDate: new Date(),
		caseCreatedDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION }
		},
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(61)),
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(61)),
		planningObligation: true,
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		conservationArea: true,
		protectedSpecies: false,
		isGreenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'change-extensions',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		AppealCaseLpaNotificationMethod: {
			create: {
				lPANotificationMethodsKey: 'notice'
			}
		},
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		// planning officer reports
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
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
		lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		changedDevelopmentDescription: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal27 }
		},
		LPACode: 'Q1111',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		appellantCostsAppliedFor: true,
		applicationReference: '12/2323232/PLA',
		rule6StatementPublished: true,
		casePublishedDate: new Date(),
		caseReference: '1212124',
		siteAddressLine1: 'Decided',
		siteAddressLine2: '5 year withdraw test',
		siteAddressTown: 'dismissed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseValidDate: new Date(),
		caseCreatedDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED }
		},
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(60)),
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(60)),
		planningObligation: true,
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		conservationArea: true,
		protectedSpecies: false,
		isGreenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'change-extensions',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		AppealCaseLpaNotificationMethod: {
			create: {
				lPANotificationMethodsKey: 'letter'
			}
		},
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		// planning officer reports
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
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
		lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		changedDevelopmentDescription: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appeal28 }
		},
		LPACode: 'Q1111',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		appellantCostsAppliedFor: true,
		applicationReference: '12/2323232/PLA',
		rule6StatementPublished: true,
		casePublishedDate: new Date(),
		caseReference: '1212125',
		siteAddressLine1: 'Decided',
		siteAddressLine2: '5 year withdraw test',
		siteAddressTown: 'allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseValidDate: new Date(),
		caseCreatedDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED }
		},
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(59)),
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(59)),
		planningObligation: true,
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		conservationArea: true,
		protectedSpecies: false,
		isGreenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'change-extensions',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		AppealCaseLpaNotificationMethod: {
			create: {
				lPANotificationMethodsKey: 'notice'
			}
		},
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		// planning officer reports
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
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
		lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		changedDevelopmentDescription: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: lpaAppealIds.appealFifteen }
		},
		LPACode: 'Q1111',
		applicationDecision: 'refused',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		appellantCostsAppliedFor: true,
		applicationReference: '12/2323232/PLA',
		rule6StatementPublished: true,
		lpaStatementPublished: true,
		casePublishedDate: new Date(),
		caseReference: '1000014',
		siteAddressLine1: 'split decision',
		siteAddressLine2: null,
		siteAddressTown: 'split decision',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseValidDate: new Date(),
		caseCreatedDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		lpaFinalCommentsPublished: true,
		appellantFinalCommentsSubmitted: true,
		statementDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmitted: pickRandom(datesNMonthsAgo(1)),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAgo(1)),
		LPAProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		appellantsProofsSubmitted: pickRandom(datesNMonthsAgo(1)),
		lpaProofEvidencePublished: true,
		appellantProofEvidencePublished: true,
		rule6ProofsEvidencePublished: true,
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION }
		},
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(1)),
		caseDecisionPublishedDate: pickRandom(datesNMonthsAgo(1)),
		planningObligation: true,
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		conservationArea: true,
		protectedSpecies: false,
		isGreenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'other',
		otherDesignationDetails: 'test other',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		// environmental
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'change-extensions',
		sensitiveArea: true,
		sensitiveAreaDetails: 'Example text',
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		AppealCaseLpaNotificationMethod: {
			create: {
				lPANotificationMethodsKey: 'notice'
			}
		},
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: true,
		// planning officer reports
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
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
		lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		changedDevelopmentDescription: true,
		newConditionDetails: 'Example new conditions',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyCommentsPublished: true,
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
		CaseType: { connect: { processCode: 'S78' } },
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
	}
];

module.exports = {
	lpaAppealCaseData,
	lpaAppeals
};
