const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const { lpaAppealCaseData, lpaAppeals, createAppealCase } = require('./lpa-appeal-case-data-dev');
const { representations, representationDocuments } = require('./representations-data-dev');
const { appealDocuments } = require('./appeal-documents-dev');
const {
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_DOCUMENT_TYPE,
	APPEAL_VIRUS_CHECK_STATUS
} = require('@planning-inspectorate/data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { testLPACode2 } = require('@pins/common/src/utils');
const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const config = require('../configuration/config.js');
const { lpasDev } = require('./lpa-dev');
const { getAppealInState, generateCaseRef } = require('./seed-appeal');
const { TEST_LPA_CODES } = require('@pins/common/src/constants');

// some data here so we can reference in multiple places
// IDs have no specific meaning, just valid UUIDs and used for upsert/relations

/**
 * @param {number} daysToAdd
 * @param {number} hour
 * @returns {Date}
 */
const getFutureDate = (daysToAdd, hour = 12) => {
	let today = new Date();
	today.setDate(today.getDate() + daysToAdd);
	return new Date(today.getFullYear(), today.getMonth(), today.getDay(), hour);
};

const appellants = {
	appellantOne: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a11',
		email: 'appellant1@planninginspectorate.gov.uk'
	},
	appellantTwo: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a12',
		email: 'appellant2@planninginspectorate.gov.uk'
	},
	appellantThree: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a13',
		email: 'appellant3@planninginspectorate.gov.uk'
	},
	appellantFour: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a14',
		email: 'appellant4@planninginspectorate.gov.uk'
	},
	appellantFive: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a15',
		email: 'appellant5@planninginspectorate.gov.uk'
	},
	appellantSix: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a16',
		email: 'appellant6@planninginspectorate.gov.uk'
	},
	appellantSeven: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a17',
		email: 'appellant7@planninginspectorate.gov.uk'
	},
	appellantEight: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a18',
		email: 'appellant8@planninginspectorate.gov.uk'
	}
};

const rule6Parties = {
	r6One: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b11',
		email: 'r6-1@planninginspectorate.gov.uk'
	},
	r6Two: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b12',
		email: 'r6-2@planninginspectorate.gov.uk'
	},
	r6Three: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b13',
		email: 'r6-3@planninginspectorate.gov.uk'
	},
	r6Four: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b14',
		email: 'r6-4@planninginspectorate.gov.uk'
	},
	r6Five: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b15',
		email: 'r6-5@planninginspectorate.gov.uk'
	},
	r6Six: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b16',
		email: 'r6-6@planninginspectorate.gov.uk'
	},
	r6Seven: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b17',
		email: 'r6-7@planninginspectorate.gov.uk'
	},
	r6Eight: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b18',
		email: 'r6-8@planninginspectorate.gov.uk'
	}
};

const lpaUsers = {
	lpaUser: {
		id: '248c46a4-400a-4128-9ea9-fc35c2420b9e',
		email: 'user1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: false,
		lpaCode: TEST_LPA_CODES.Q9999,
		lpaStatus: 'added'
	},
	lpaUser2: {
		id: '795ac593-4fe9-478c-8434-457db576a733',
		email: 'user2@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: false,
		lpaCode: TEST_LPA_CODES.Q1111,
		lpaStatus: 'added'
	},
	lpaAdmin: {
		id: '3e0b7bc5-c91a-456c-b36d-260b2a52aa70',
		email: 'admin1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: true,
		lpaCode: TEST_LPA_CODES.Q9999,
		lpaStatus: 'confirmed'
	},
	lpaAdmin2: {
		id: '59a82253-4309-45c4-8f6e-5412e2e9be9b',
		email: 'admin2@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: true,
		lpaCode: TEST_LPA_CODES.Q1111,
		lpaStatus: 'confirmed'
	}
};

const appealIds = {
	appealOne: '756d6bfb-dde8-4532-a041-86c226a23a01',
	appealTwo: '756d6bfb-dde8-4532-a041-86c226a23a02',
	appealThree: '756d6bfb-dde8-4532-a041-86c226a23a03',
	appealFour: '756d6bfb-dde8-4532-a041-86c226a23a04',
	appealFive: '756d6bfb-dde8-4532-a041-86c226a23a05',
	appealSix: '756d6bfb-dde8-4532-a041-86c226a23a06',
	appealSeven: '756d6bfb-dde8-4532-a041-86c226a23a07',
	appealEight: '756d6bfb-dde8-4532-a041-86c226a23a08',
	appealNine: 'd8290e68-bfbb-3bc8-b621-5a9590aa29fd',
	appealTen: 'f933b0e0-1694-11ef-ab42-cbf3edc5e3fd',
	appeal11: 'ee283ae8-7a92-4afe-a93f-405689b1f35b',
	appeal12: '7573b265-f529-4b0b-adf1-659cc70c180f',
	appeal13: '1f72d00c-03fa-48be-8ded-a9580e65f7a5',
	appeal14: '437c4af5-7440-486d-98e9-b37a748be96c',
	appeal15: '5b769d3f-466c-427a-9d58-d9823239ee9b',
	appeal16: 'e2e772d4-e688-465f-802c-59a69e43a9ea'
};

const caseReferences = {
	caseReferenceOne: '1010101',
	caseReferenceTwo: '1010102',
	caseReferenceThree: '1010103',
	caseReferenceFour: '1010104',
	caseReferenceFive: '1010105',
	caseReferenceSix: '1010106',
	caseReferenceSeven: '1010107',
	caseReferenceEight: '1010108',
	caseReferenceNine: '1010109',
	caseReferenceTen: '1010110',
	caseReference13: '2201010',
	caseReference14: '2211010',
	caseReference15: '2221010',
	caseReference16: '2231010'
};

const appellantSubmissionIds = {
	// v2 draft submissions ids
	appellantSubmissionOne: 'a99c8871-2a4a-4e9c-85b3-498e39d5fafb',
	appellantSubmissionTwo: '13da68dd-6c0c-591f-a183-3fadbbb30c37',
	appellantSubmissionThree: '99e2c1bc-5e45-479b-8c9c-c4b41f6bcdb5'
};

const appealSubmissionDraft = {
	// ID in Cosmos, see dev/data
	id: '89aa8504-773c-42be-bb68-029716ad9756',
	idTwo: 'ac3643e6-e680-4230-9c3c-66d90c3ecdfe'
};

/**
 * @type {import('@prisma/client').Prisma.AppealUserCreateInput[]}
 */
const users = [
	lpaUsers.lpaUser,
	lpaUsers.lpaUser2,
	lpaUsers.lpaAdmin,
	lpaUsers.lpaAdmin2,
	appellants.appellantOne,
	appellants.appellantTwo,
	appellants.appellantThree,
	appellants.appellantFour,
	appellants.appellantFive,
	appellants.appellantSix,
	appellants.appellantSeven,
	appellants.appellantEight,
	rule6Parties.r6One,
	rule6Parties.r6Two,
	rule6Parties.r6Three,
	rule6Parties.r6Four,
	rule6Parties.r6Five,
	rule6Parties.r6Six,
	rule6Parties.r6Seven,
	rule6Parties.r6Eight
];

/**
 * @type {import('@prisma/client').Prisma.AppealCreateInput[]}
 */
const appeals = [
	{ id: appealIds.appealOne },
	{ id: appealIds.appealTwo },
	{ id: appealIds.appealThree },
	{ id: appealIds.appealFour },
	{ id: appealIds.appealFive },
	{ id: appealIds.appealSix },
	{ id: appealIds.appealSeven },
	{ id: appealIds.appealEight },
	{ id: appealIds.appealNine },
	{ id: appealIds.appealTen },
	{ id: appealIds.appeal11 },
	{ id: appealIds.appeal12 },
	{ id: appealIds.appeal13 },
	{ id: appealIds.appeal14 },
	{ id: appealIds.appeal15 },
	{ id: appealIds.appeal16 },
	{
		id: appealSubmissionDraft.id,
		legacyAppealSubmissionId: appealSubmissionDraft.id,
		legacyAppealSubmissionState: 'DRAFT'
	},
	{
		id: appealSubmissionDraft.idTwo,
		legacyAppealSubmissionId: appealSubmissionDraft.idTwo,
		legacyAppealSubmissionState: 'DRAFT'
	},
	...lpaAppeals
];

const commonAppealProperties = {
	LPACode: TEST_LPA_CODES.Q1111,
	siteAddressLine1: '123 Fake Street',
	siteAddressTown: 'Testville',
	siteAddressCounty: 'Countyshire',
	siteAddressPostcode: 'BS1 6PN',
	siteAddressPostcodeSanitized: 'BS16PN',
	appellantCostsAppliedFor: false,
	casePublishedDate: new Date(),
	caseCreatedDate: new Date(),
	caseSubmittedDate: new Date(),
	CaseType: {
		connect: { processCode: 'HAS' }
	},
	CaseStatus: {
		connect: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE }
	}
};

/**
 * @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]}
 */
const appealCases = [
	{
		Appeal: {
			connect: { id: appealIds.appeal11 }
		},
		caseReference: caseReferences.caseReferenceNine,
		caseId: 131313,
		LPACode: TEST_LPA_CODES.Q1111,
		CaseType: {
			connect: { processCode: 'HAS' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.ISSUE_DETERMINATION }
		},
		ProcedureType: {
			connect: { key: APPEAL_CASE_PROCEDURE.WRITTEN }
		},
		applicationReference: 'HAS/ONLY',
		applicationDecision: 'Refused',
		applicationDate: new Date(),
		applicationDecisionDate: new Date(),
		caseSubmissionDueDate: new Date(),

		isGreenBelt: true,
		inConservationArea: true,
		enforcementNotice: false,

		siteAddressLine1: 'HAS Example',
		siteAddressLine2: 'Testing',
		siteAddressTown: 'Testville',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS2 6PN',
		siteAddressPostcodeSanitized: 'BS26PN',
		siteAccessDetails: '["Open the gate"]',
		siteSafetyDetails: '["Watch out for nails", "And the goat"]',
		siteAreaSquareMetres: 67,
		appellantCostsAppliedFor: true,
		ownsAllLand: false,
		ownsSomeLand: true,
		knowsOtherOwners: 'Yes',
		knowsAllOwners: null,
		advertisedAppeal: false,
		ownersInformed: true,
		originalDevelopmentDescription: 'A major change',

		isCorrectAppealType: true,
		lpaCostsAppliedFor: true,
		changedDevelopmentDescription: true,
		newConditionDetails: 'More details here',
		lpaStatement: 'This is asked outside of journey for HAS',
		CaseValidationOutcome: {
			connect: { key: APPEAL_CASE_VALIDATION_OUTCOME.VALID }
		},
		caseValidationInvalidDetails: null,
		caseValidationIncompleteDetails: null,
		lpaQuestionnaireValidationDetails: null,

		caseSubmittedDate: new Date(),
		caseCreatedDate: new Date(),
		caseUpdatedDate: new Date(),
		caseValidDate: new Date(),
		caseValidationDate: new Date(),
		caseExtensionDate: new Date(),
		caseStartedDate: new Date(),
		casePublishedDate: new Date(),
		caseWithdrawnDate: null,
		caseTransferredDate: null,
		transferredCaseClosedDate: null,
		caseDecisionOutcomeDate: null,
		caseDecisionPublishedDate: null,
		caseCompletedDate: null,

		lpaQuestionnaireDueDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		lpaQuestionnaireCreatedDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		lpaQuestionnaireValidationOutcomeDate: new Date()
	},
	{
		Appeal: {
			connect: { id: appealIds.appealOne }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceOne,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323231/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: new Date(),
		appellantCommentsSubmittedDate: new Date(),
		caseValidDate: new Date(),
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAhead(2)),
		// questionnaire details
		// constraints
		isCorrectAppealType: true,
		scheduledMonument: false,
		protectedSpecies: null,
		isGreenBelt: true,
		areaOutstandingBeauty: null,
		designatedSitesNames: null,
		gypsyTraveller: null,
		publicRightOfWay: null,
		// environmental
		environmentalImpactSchedule: null,
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		// consultations
		statutoryConsultees: false,
		// planning officer reports
		infrastructureLevy: null,
		infrastructureLevyAdopted: null,
		infrastructureLevyExpectedDate: null,
		// site access
		siteAccessDetails: '["access details from appellant", "access details from LPA"]',
		siteSafetyDetails: '["safety details from appellant", "safety details from LPA"]',
		// appeal process
		lpaProcedurePreference: null,
		lpaProcedurePreferenceDetails: null,
		lpaProcedurePreferenceDuration: null,
		changedDevelopmentDescription: null,
		newConditionDetails: 'Example new conditions'
	},
	{
		Appeal: {
			connect: { id: appealIds.appealTwo }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceTwo,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(2)),
		applicationReference: '12/2323232/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } }
	},
	{
		Appeal: {
			connect: { id: appealIds.appealThree }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceThree,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323233/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: new Date(),
		caseValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(1)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED }
		},
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } }
	},
	{
		Appeal: {
			connect: { id: appealIds.appealFour }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceFour,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323234/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		lpaQuestionnaireCreatedDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublishedDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		caseValidDate: new Date(),
		appellantCommentsSubmittedDate: new Date(),
		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.WRITTEN } }
	},
	{
		Appeal: {
			connect: { id: appealIds.appealFive }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceFive,
		applicationDecision: 'allowed',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323235/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		casePublishedDate: new Date()
	},
	{
		Appeal: {
			connect: { id: appealIds.appealSix }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceSix,
		applicationDecision: 'dismissed',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323236/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(2)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED }
		}
	},
	{
		Appeal: {
			connect: { id: appealIds.appealSeven }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceSeven,
		applicationDecision: 'allowed in part',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323237/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(3)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION }
		}
	},
	{
		Appeal: {
			connect: { id: appealIds.appealEight }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceEight,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(4)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED }
		}
	},
	{
		Appeal: {
			connect: { id: appealIds.appeal12 }
		},
		LPACode: TEST_LPA_CODES.Q1111,
		siteAddressLine1: '123 Fake Street',
		siteAddressTown: 'Birmingham',
		siteAddressCounty: 'West Midlands',
		siteAddressPostcode: 'B44 0QS',
		appellantCostsAppliedFor: false,
		casePublishedDate: pickRandom(datesNMonthsAgo(2)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(2)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(2)),
		CaseType: {
			connect: { processCode: 'S78' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.COMPLETE }
		},
		caseReference: caseReferences.caseReferenceTen,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcomeDate: pickRandom(datesNMonthsAgo(4)),
		CaseDecisionOutcome: {
			connect: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED }
		}
	},
	{
		Appeal: {
			connect: { id: appealIds.appeal13 }
		},
		LPACode: TEST_LPA_CODES.Q1111,
		siteAddressLine1: '124 Fake Street',
		siteAddressTown: 'Bristol',
		siteAddressCounty: 'Bristolshire',
		siteAddressPostcode: 'BS1 6PN',
		siteAddressPostcodeSanitized: 'BS16PN',
		appellantCostsAppliedFor: false,
		casePublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		CaseType: {
			connect: { processCode: 'S78' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE }
		},
		ProcedureType: {
			connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY }
		},
		caseReference: caseReferences.caseReference13,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2))
	},
	{
		Appeal: {
			connect: { id: appealIds.appeal14 }
		},
		LPACode: TEST_LPA_CODES.Q1111,
		siteAddressLine1: '124 Fake Street',
		siteAddressTown: 'Bristol',
		siteAddressCounty: 'Bristolshire',
		siteAddressPostcode: 'BS1 6PN',
		siteAddressPostcodeSanitized: 'BS16PN',
		appellantCostsAppliedFor: false,
		casePublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		CaseType: {
			connect: { processCode: 'S78' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS }
		},
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		appellantCommentsSubmittedDate: new Date(),
		ProcedureType: {
			connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY }
		},
		caseReference: caseReferences.caseReference14,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2))
	},
	{
		Appeal: {
			connect: { id: appealIds.appeal15 }
		},
		LPACode: TEST_LPA_CODES.Q1111,
		siteAddressLine1: '125 Fake Street',
		siteAddressTown: 'Bristol',
		siteAddressCounty: 'Bristolshire',
		siteAddressPostcode: 'BS1 6PN',
		siteAddressPostcodeSanitized: 'BS16PN',
		appellantCostsAppliedFor: false,
		casePublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		CaseType: {
			connect: { processCode: 'S78' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.EVIDENCE }
		},
		appellantCommentsSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		finalCommentsDueDate: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		LPACommentsSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		appellantProofsSubmittedDate: new Date(),
		LPAProofsSubmittedDate: new Date(),
		ProcedureType: {
			connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY }
		},
		caseReference: caseReferences.caseReference15,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2))
	},
	{
		Appeal: {
			connect: { id: appealIds.appeal16 }
		},
		LPACode: TEST_LPA_CODES.Q1111,
		siteAddressLine1: '124 Fake Street',
		siteAddressTown: 'Bristol',
		siteAddressCounty: 'Bristolshire',
		siteAddressPostcode: 'BS1 6PN',
		appellantCostsAppliedFor: false,
		casePublishedDate: pickRandom(datesNMonthsAgo(1)),
		caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
		caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		CaseType: {
			connect: { processCode: 'S78' }
		},
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.STATEMENTS }
		},
		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		LPAStatementSubmittedDate: pickRandom(datesNMonthsAgo(1)),
		appellantCommentsSubmittedDate: new Date(),
		ProcedureType: {
			connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY }
		},
		caseReference: caseReferences.caseReference16,
		applicationDecision: '',
		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
		applicationReference: '12/2323238/PLA',
		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2))
	},
	...lpaAppealCaseData
];

/**
 * Link users to appeals
 *
 * @type {{appealId: string, userId: string, role: string}[]}
 */
const linkedLpaAppeals = lpaAppeals.map((appeal) => ({
	appealId: appeal.id,
	userId: appellants.appellantOne.id,
	role: APPEAL_USER_ROLES.APPELLANT
}));

const linkedLpaR6Appeals = lpaAppeals.map((appeal) => ({
	appealId: appeal.id,
	userId: rule6Parties.r6One.id,
	role: APPEAL_USER_ROLES.RULE_6_PARTY
}));

const appealToUsers = [
	{
		appealId: appealIds.appealOne,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealTwo,
		userId: appellants.appellantTwo.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealThree,
		userId: appellants.appellantThree.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealFour,
		userId: appellants.appellantFour.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealFive,
		userId: appellants.appellantFive.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealSix,
		userId: appellants.appellantSix.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealSeven,
		userId: appellants.appellantSeven.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealEight,
		userId: appellants.appellantEight.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealSubmissionDraft.id,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealSubmissionDraft.idTwo,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealNine,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appealTen,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appeal11,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appeal13,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appeal14,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	{
		appealId: appealIds.appeal15,
		userId: appellants.appellantOne.id,
		role: APPEAL_USER_ROLES.APPELLANT
	},
	...linkedLpaAppeals,
	// rule 6 party links
	{
		appealId: appealIds.appealOne,
		userId: rule6Parties.r6One.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealOne,
		userId: rule6Parties.r6Two.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealTwo,
		userId: rule6Parties.r6Two.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealThree,
		userId: rule6Parties.r6Three.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealFour,
		userId: rule6Parties.r6Four.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealFive,
		userId: rule6Parties.r6Five.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealSix,
		userId: rule6Parties.r6Six.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealSeven,
		userId: rule6Parties.r6Seven.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appealEight,
		userId: rule6Parties.r6Eight.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appeal15,
		userId: rule6Parties.r6One.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	{
		appealId: appealIds.appeal16,
		userId: rule6Parties.r6One.id,
		role: APPEAL_USER_ROLES.RULE_6_PARTY
	},
	...linkedLpaR6Appeals
];

/**
 * @type {import('@prisma/client').Prisma.ServiceUserCreateInput[]}
 */
const serviceUsers = [
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a81',
		id: '123451',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceOne,
		firstName: 'Appellant',
		lastName: 'One',
		emailAddress: 'appellant1@planninginspectorate.gov.uk'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a89',
		id: '123451',
		serviceUserType: 'Appellant',
		caseReference: '1000014',
		firstName: 'Appellant',
		lastName: 'One',
		emailAddress: 'appellant1@planninginspectorate.gov.uk'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a82',
		id: '123452',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceTwo,
		firstName: 'Appellant',
		lastName: 'Two',
		emailAddress: 'test2@example.com',
		telephoneNumber: '21234567890'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a83',
		id: '123453',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceThree,
		firstName: 'Appellant',
		lastName: 'Three'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a84',
		id: '123454',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceFour,
		firstName: 'Appellant',
		lastName: 'Four'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a85',
		id: '123455',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceFive,
		firstName: 'Appellant',
		lastName: 'Five'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a86',
		id: '123456',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceSix,
		firstName: 'Appellant',
		lastName: 'Six'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a87',
		id: '123457',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceSeven,
		firstName: 'Appellant',
		lastName: 'Seven'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a88',
		id: '123458',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceEight,
		firstName: 'Appellant',
		lastName: 'Eight'
	},
	{
		internalId: '90e7e328-0631-4373-8bd6-0d431b736120',
		id: '12346',
		serviceUserType: 'Agent',
		caseReference: caseReferences.caseReferenceOne,
		firstName: 'Agent',
		lastName: 'One',
		emailAddress: 'test@example.com',
		telephoneNumber: '01234567890'
	},
	{
		internalId: '1c543b78-0fd6-4e86-abc3-28bea670d3c9',
		id: '123459',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceNine,
		firstName: 'Appellant',
		lastName: 'Nine'
	},
	{
		internalId: 'f53d3c7a-9fff-47d7-ab5b-a39f0e3cfc48',
		id: '123460',
		serviceUserType: 'Agent',
		caseReference: caseReferences.caseReferenceNine,
		firstName: 'Agent',
		lastName: 'Nine'
	},
	{
		internalId: 'f53d3c7a-9fff-47d7-ab5b-a39f0e3cfc47',
		id: '123475',
		serviceUserType: 'Appellant',
		caseReference: '6666666',
		firstName: 'Appellant',
		lastName: 'One',
		emailAddress: 'appellant1@planninginspectorate.gov.uk'
	},
	{
		internalId: 'f53d3c7a-9fff-47d7-ab5b-a39f0e3cfc23',
		id: '123998',
		serviceUserType: 'Rule6Party',
		caseReference: '1000014',
		firstName: 'Rule6Party',
		lastName: 'One',
		emailAddress: 'r6-1@planninginspectorate.gov.uk'
	},
	{
		internalId: 'f53d3c7a-9fff-47d7-ab5b-a39f0e3cfc24',
		id: '123999',
		serviceUserType: 'Rule6Party',
		caseReference: '1000014',
		firstName: 'Rule6Party',
		lastName: 'Two',
		emailAddress: 'r6-2@planninginspectorate.gov.uk'
	},
	{
		internalId: 'f53d3c7a-9fff-47d7-ab5b-a39f0e3cfc55',
		id: '123997',
		serviceUserType: 'Rule6Party',
		caseReference: '1000014',
		firstName: 'Rule6Party',
		lastName: 'Three',
		emailAddress: 'r6-3@planninginspectorate.gov.uk'
	}
];

/**
 * @type {import('@prisma/client').Prisma.NeighbouringAddressCreateInput[]}
 */
const neighbourAddresses = [
	{
		id: '72177e1e-8891-4e2a-bd24-64f848fd84ef',
		addressLine1: '172 York Road',
		townCity: 'Bristol',
		postcode: 'BS3 4AL',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		}
	},
	{
		id: '7c78d411-8de2-4a46-9b69-176328cf9625',
		addressLine1: 'Screwfix',
		addressLine2: '170 York Road',
		townCity: 'Bristol',
		postcode: 'BS3 4AL',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		}
	},
	{
		id: '9460d680-d056-4d92-8ac9-7e4d1725afc4',
		addressLine1: 'B&Q',
		addressLine2: '17 York Road',
		townCity: 'Bristol',
		postcode: 'BS3 4AL',
		AppealCase: {
			connect: {
				caseReference: '1010101'
			}
		}
	},
	{
		id: 'b040b7f9-3626-4cff-92a5-bc4db45bcc66',
		addressLine1: 'B&Q',
		addressLine2: '17 York Road',
		townCity: 'Bristol',
		postcode: 'BS3 4AL',
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		}
	},
	{
		id: 'b602201a-c57c-4b87-b229-8f4e17b7b4c8',
		addressLine1: 'Screwfix',
		addressLine2: '170 York Road',
		townCity: 'Bristol',
		postcode: 'BS3 4AL',
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		}
	}
];

/**
 * @type {import('@prisma/client').Prisma.ListedBuildingCreateInput[]}
 */
const listedBuildings = [
	{
		name: '10 and 10A Special House',
		reference: '1010101',
		listedBuildingGrade: 'II'
	},
	{
		name: 'AN IMPORTANT BUILDING',
		reference: '1010102',
		listedBuildingGrade: 'II*'
	},
	{
		name: 'Exceptional Building',
		reference: '1010103',
		listedBuildingGrade: 'I'
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealCaseListedBuildingCreateInput[]}
 */
const caseListedBuilding = [
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		},
		ListedBuilding: {
			connect: {
				reference: listedBuildings[0].reference
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		},
		ListedBuilding: {
			connect: {
				reference: listedBuildings[1].reference
			}
		}
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealCaseLpaNotificationMethodCreateInput[]}
 */
const caseNotificationMethods = [
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceOne
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'notice'
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceOne
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'notice'
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceOne
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'letter'
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceOne
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'advert'
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'notice'
			}
		}
	},
	{
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		},
		LPANotificationMethod: {
			connect: {
				key: 'letter'
			}
		}
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealCaseRelationshipCreateInput[]}
 */
const caseRelations = [
	{
		caseReference: caseReferences.caseReferenceOne,
		caseReference2: caseReferences.caseReferenceNine,
		type: CASE_RELATION_TYPES.nearby
	},
	{
		caseReference: caseReferences.caseReferenceNine,
		caseReference2: caseReferences.caseReferenceOne,
		type: CASE_RELATION_TYPES.nearby
	}
];

/**
 * @type { import('@prisma/client').Prisma.EventCreateInput[] }
 */
const events = [
	{
		internalId: '1d3a7697-2dab-45be-bb36-45532e173ca0',
		published: true,
		type: 'siteVisit',
		subtype: 'accompanied',
		startDate: pickRandom(datesNMonthsAgo(1)),
		endDate: pickRandom(datesNMonthsAhead(1)),
		AppealCase: {
			connect: {
				caseReference: '1010101'
			}
		}
	},
	{
		internalId: '6e37eecf-216f-42b2-95cc-7484f0db0bd5',
		published: true,
		type: 'siteVisit',
		subtype: 'unaccompanied',
		startDate: null,
		endDate: null,
		AppealCase: {
			connect: {
				caseReference: '1010102'
			}
		}
	},
	{
		internalId: 'b400feaf-b7ea-493c-b8b5-7ca9311696b8',
		published: true,
		type: 'siteVisit',
		subtype: 'accessRequired',
		startDate: getFutureDate(30, 9),
		endDate: getFutureDate(30, 17),
		AppealCase: {
			connect: {
				caseReference: '1010103'
			}
		}
	},
	{
		internalId: '6c4f6b1f-3206-4ba4-a7e1-c56ca1c83730',
		published: true,
		type: 'siteVisit',
		subtype: 'accessRequired',
		startDate: getFutureDate(40, 11),
		endDate: getFutureDate(40, 15),
		AppealCase: {
			connect: {
				caseReference: '1010104'
			}
		}
	},
	{
		internalId: '6c4f6b1f-3206-4ba4-a7e1-c56ca1c83730',
		published: true,
		type: 'siteVisit',
		subtype: 'accessRequired',
		startDate: getFutureDate(40, 11),
		endDate: getFutureDate(40, 15),
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceNine
			}
		}
	},
	{
		internalId: '1e3a7697-2dab-45be-bb36-45532e173ca0',
		published: true,
		type: 'inquiry',
		subtype: null,
		addressLine1: '101 Testing Road',
		addressCounty: 'Countyshire',
		addressPostcode: 'AB1 2CD',
		addressTown: 'Test Town',
		startDate: getFutureDate(40, 11),
		endDate: getFutureDate(43, 11),
		AppealCase: {
			connect: {
				caseReference: '0000002'
			}
		}
	},
	{
		internalId: '1f3a7697-2dab-45be-bb36-45532e173ca0',
		published: true,
		type: 'hearing',
		subtype: null,
		startDate: getFutureDate(25, 11),
		endDate: getFutureDate(26, 13),
		AppealCase: {
			connect: {
				caseReference: '0000001'
			}
		}
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppellantSubmissionCreateInput[]}
 */
const appellantSubmissions = [
	// v2 appellant submissions
	{
		id: appellantSubmissionIds.appellantSubmissionOne,
		LPACode: TEST_LPA_CODES.Q1111,
		appealTypeCode: 'HAS',
		Appeal: {
			connect: { id: appealIds.appealOne }
		},
		submitted: true
	},
	{
		id: appellantSubmissionIds.appellantSubmissionTwo,
		LPACode: TEST_LPA_CODES.Q1111,
		appealTypeCode: 'HAS',
		applicationDecisionDate: new Date(),
		Appeal: {
			connect: { id: appealIds.appealNine }
		}
	},
	{
		id: appellantSubmissionIds.appellantSubmissionThree,
		LPACode: TEST_LPA_CODES.Q1111,
		appealTypeCode: 'HAS',
		applicationDecisionDate: new Date('2024-03-01'),
		Appeal: {
			connect: { id: appealIds.appealTen }
		}
	}
];

/**
 * @type {import('@prisma/client').Prisma.SubmissionAddressCreateInput[]}
 */
const submissionAddresses = [
	{
		id: '461041d8-a816-4cf6-b1b8-6ad010917bcc',
		addressLine1: '9 fake street',
		townCity: 'Bristol',
		postcode: 'BS1 6PN',
		fieldName: 'siteAddress',
		AppellantSubmission: {
			connect: { id: appellantSubmissionIds.appellantSubmissionThree }
		}
	}
];

/**
 * @param {import('@prisma/client').PrismaClient} dbClient
 */
async function seedDev(dbClient) {
	// ordering here is important to ensure relations are built up
	// e.g. appeals + users before appeal-to-users

	for (const listed of listedBuildings) {
		await dbClient.listedBuilding.upsert({
			create: listed,
			update: listed,
			where: { reference: listed.reference }
		});
	}

	// create some users
	for (const user of users) {
		await dbClient.appealUser.upsert({
			create: user,
			update: user,
			where: { email: user.email }
		});
	}

	// create some appeals (linked to Cosmos data)
	for (const appeal of appeals) {
		await dbClient.appeal.upsert({
			create: appeal,
			update: appeal,
			where: { id: appeal.id }
		});
	}

	const caseIds = [];
	// create some appeal cases
	for (const appealCase of appealCases) {
		const createdCase = await dbClient.appealCase.upsert({
			create: appealCase,
			update: appealCase,
			where: { caseReference: appealCase.caseReference }
		});
		caseIds.push(createdCase.id);
	}

	const s20AppealQuestionnarire = createAppealCase(
		'3000000',
		testLPACode2,
		CASE_TYPES.S20.processCode,
		'questionnaire'
	);

	await dbClient.appealCase.upsert({
		create: {
			...s20AppealQuestionnarire,
			Appeal: { create: {} }
		},
		update: s20AppealQuestionnarire,
		where: { caseReference: s20AppealQuestionnarire.caseReference }
	});

	for (const caseId of caseIds) {
		for (const document of appealDocuments) {
			document.documentURI = `${config.storage.boEndpoint}/${document.filename}`;
			document.publishedDocumentURI = `${config.storage.boEndpoint}/${document.filename}`;

			document.AppealCase = {
				connect: { id: caseId }
			};

			await dbClient.document.upsert({
				create: document,
				update: document,
				where: { id: document.id }
			});
		}
	}

	for (const caseListed of caseListedBuilding) {
		const existing = await dbClient.appealCaseListedBuilding.findFirst({
			where: {
				AND: [
					{ caseReference: caseListed.AppealCase.connect.caseReference },
					{ listedBuildingReference: caseListed.ListedBuilding.connect.reference }
				]
			}
		});

		if (!existing) {
			await dbClient.appealCaseListedBuilding.create({
				data: caseListed
			});
		}
	}

	for (const caseNotification of caseNotificationMethods) {
		const existing = await dbClient.appealCaseLpaNotificationMethod.findFirst({
			where: {
				AND: [
					{ caseReference: caseNotification.AppealCase?.connect?.caseReference },
					{ lPANotificationMethodsKey: caseNotification.LPANotificationMethod?.connect?.key }
				]
			}
		});

		if (!existing) {
			await dbClient.appealCaseLpaNotificationMethod.create({
				data: caseNotification
			});
		}
	}

	for (const caseRelation of caseRelations) {
		const existing = await dbClient.appealCaseRelationship.findFirst({
			where: {
				AND: [
					{ caseReference: caseRelation.caseReference },
					{ caseReference2: caseRelation.caseReference2 }
				]
			}
		});

		if (!existing) {
			await dbClient.appealCaseRelationship.create({
				data: caseRelation
			});
		}
	}

	// link some users to appeals (e.g. appellants/agents)
	for (const { appealId, userId, role } of appealToUsers) {
		const appealToUser = {
			Appeal: {
				connect: { id: appealId }
			},
			Role: {
				connect: { name: role }
			},
			AppealUser: {
				connect: { id: userId }
			}
		};

		const existingUserLinks = await dbClient.appealToUser.findMany({
			where: {
				appealId: appealId,
				userId: userId
			}
		});

		if (role === APPEAL_USER_ROLES.RULE_6_PARTY) {
			if (!existingUserLinks.some((x) => x.role === APPEAL_USER_ROLES.RULE_6_PARTY)) {
				await dbClient.appealToUser.create({
					data: appealToUser
				});
			} else {
				// do nothing
			}
		} else {
			const existingRoles = existingUserLinks.filter(
				(x) => x.role === APPEAL_USER_ROLES.APPELLANT || x.role === APPEAL_USER_ROLES.AGENT
			);

			if (existingRoles.length !== 0) {
				await dbClient.appealToUser.update({
					where: {
						id: existingRoles[0].id
					},
					data: { ...appealToUser }
				});
			} else {
				await dbClient.appealToUser.create({
					data: appealToUser
				});
			}
		}
	}

	for (const serviceUser of serviceUsers) {
		await dbClient.serviceUser.upsert({
			create: serviceUser,
			update: serviceUser,
			where: { internalId: serviceUser.internalId }
		});
	}

	for (const neighbourAddress of neighbourAddresses) {
		await dbClient.neighbouringAddress.upsert({
			create: neighbourAddress,
			update: neighbourAddress,
			where: { id: neighbourAddress.id }
		});
	}

	for (const appellantSubmission of appellantSubmissions) {
		await dbClient.appellantSubmission.upsert({
			create: appellantSubmission,
			update: appellantSubmission,
			where: { appealId: appellantSubmission.Appeal.connect?.id }
		});
	}

	for (const submissionAddress of submissionAddresses) {
		await dbClient.submissionAddress.upsert({
			create: submissionAddress,
			update: submissionAddress,
			where: { id: submissionAddress.id }
		});
	}

	for (const event of events) {
		await dbClient.event.upsert({
			create: event,
			update: event,
			where: { internalId: event.internalId }
		});
	}

	for (const representation of representations) {
		await dbClient.representation.upsert({
			create: representation,
			update: representation,
			where: { id: representation.id }
		});
	}

	for (const representationDocument of representationDocuments) {
		await dbClient.representationDocument.upsert({
			create: representationDocument,
			update: representationDocument,
			where: { id: representationDocument.id }
		});
	}

	for (const lpa of lpasDev) {
		await dbClient.lPA.upsert({
			create: lpa,
			update: lpa,
			where: { id: lpa.id }
		});
	}

	await createCasesInState(dbClient);

	console.log('dev seed complete');
}

/**
 * @param {import('@prisma/client').PrismaClient} dbClient
 */
async function createCasesInState(dbClient) {
	const existingRefs = await dbClient.appealCase.findMany({
		distinct: ['caseReference'],
		select: {
			caseReference: true
		}
	});
	const refSet = new Set(
		existingRefs.map((ref) => parseInt(ref.caseReference, 10)).filter((ref) => !isNaN(ref))
	);

	const states = [
		APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
		APPEAL_CASE_STATUS.STATEMENTS,
		APPEAL_CASE_STATUS.EVIDENCE,
		APPEAL_CASE_STATUS.FINAL_COMMENTS,
		APPEAL_CASE_STATUS.COMPLETE
	];
	const variations = [
		{ type: CASE_TYPES.HAS, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.S78, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.S78, process: APPEAL_CASE_PROCEDURE.HEARING },
		{ type: CASE_TYPES.S78, process: APPEAL_CASE_PROCEDURE.INQUIRY },
		{ type: CASE_TYPES.S20, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.S20, process: APPEAL_CASE_PROCEDURE.HEARING },
		{ type: CASE_TYPES.S20, process: APPEAL_CASE_PROCEDURE.INQUIRY },
		{ type: CASE_TYPES.CAS_ADVERTS, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.CAS_PLANNING, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.ADVERTS, process: APPEAL_CASE_PROCEDURE.WRITTEN },
		{ type: CASE_TYPES.ADVERTS, process: APPEAL_CASE_PROCEDURE.HEARING },
		{ type: CASE_TYPES.ADVERTS, process: APPEAL_CASE_PROCEDURE.INQUIRY }
	];

	for (const state of states) {
		for (const variation of variations) {
			if (
				variation.type.expedited &&
				![APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, APPEAL_CASE_STATUS.COMPLETE].includes(state)
			) {
				// skip invalid states for expedited cases
				continue;
			}

			const friendlyName = `${state}-${variation.type.processCode}-${variation.process}`;

			try {
				const generatedCaseRef = generateCaseRef(4000000, refSet);
				const generatedCase = getAppealInState({
					friendlyName,
					caseReference: generatedCaseRef.toString(),
					processCode: variation.type.processCode,
					lpaCode: TEST_LPA_CODES.Q1111,
					submittingUser: appellants.appellantOne,
					appealCaseProcedure: variation.process,
					appealCaseStatus: state
				});
				refSet.add(generatedCaseRef);

				// case
				const existingCase = await dbClient.appealCase.findFirst({
					where: {
						siteAddressLine1: friendlyName
					},
					select: {
						id: true,
						caseReference: true
					}
				});

				if (existingCase) {
					await dbClient.appealCase.update({
						data: { ...generatedCase.appeal, id: undefined, caseReference: undefined },
						where: { id: existingCase.id }
					});
					await deleteSubmissionForCase(dbClient, existingCase.caseReference);
				} else {
					const createdCase = await dbClient.appealCase.create({
						data: {
							Appeal: { create: {} },
							...generatedCase.appeal
						}
					});

					await dbClient.serviceUser.createMany({
						data: [generatedCase.appellant, generatedCase.agent].filter(Boolean)
					});

					const users = [
						{
							appealId: createdCase.appealId,
							role: APPEAL_USER_ROLES.AGENT,
							userId: appellants.appellantOne.id
						}
					];

					// rule 6 user
					if (generatedCase.canHaveRule6) {
						await dbClient.serviceUser.create({
							data: {
								id: rule6Parties.r6One.id,
								emailAddress: rule6Parties.r6One.email,
								serviceUserType: APPEAL_USER_ROLES.RULE_6_PARTY,
								caseReference: generatedCaseRef.toString(),
								firstName: 'rule6',
								lastName: 'test'
							}
						});

						users.push({
							appealId: createdCase.appealId,
							role: APPEAL_USER_ROLES.RULE_6_PARTY,
							userId: rule6Parties.r6One.id
						});
					}

					await dbClient.appealToUser.createMany({
						data: users
					});

					// decision doc

					if (createdCase.caseStatus === APPEAL_CASE_STATUS.COMPLETE) {
						await dbClient.document.create({
							data: {
								dateCreated: new Date(),
								documentURI: `${config.storage.boEndpoint}/example.txt`,
								publishedDocumentURI: `${config.storage.boEndpoint}/example.txt`,
								filename: 'decision-doc.txt',
								originalFilename: 'example.txt',
								caseReference: createdCase.caseReference,
								documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER,
								size: 16,
								mime: 'text/plain',
								published: true,
								redacted: true,
								virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.SCANNED,
								sourceSystem: 'appeals',
								origin: 'pins',
								stage: 'decision'
							}
						});
					}
				}
			} catch (error) {
				console.error(`Error generating case: ${friendlyName}`, error);
			}
		}
	}
}

/**
 * @param {import('@prisma/client').PrismaClient} db
 * @param {string} caseRef
 */
async function deleteSubmissionForCase(db, caseRef) {
	const [
		lpaQuestionnaires,
		lpaStatements,
		lpaProofs,
		lpaFinals,
		appellantFinals,
		appellantProofs,
		rule6Proofs,
		rule6Statements
	] = await Promise.all([
		db.lPAQuestionnaireSubmission.findMany({
			where: { appealCaseReference: caseRef },
			select: { id: true }
		}),
		db.lPAStatementSubmission.findMany({
			where: { appealCaseReference: caseRef },
			select: { id: true }
		}),
		db.lPAProofOfEvidenceSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		}),
		db.lPAFinalCommentSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		}),
		db.appellantFinalCommentSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		}),
		db.appellantProofOfEvidenceSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		}),
		db.rule6ProofOfEvidenceSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		}),
		db.rule6StatementSubmission.findMany({
			where: { caseReference: caseRef },
			select: { id: true }
		})
	]);

	await Promise.all([
		db.submissionDocumentUpload.deleteMany({
			where: { questionnaireId: { in: lpaQuestionnaires.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { lpaStatementId: { in: lpaStatements.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { lpaProofOfEvidenceId: { in: lpaProofs.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { lpaFinalCommentId: { in: lpaFinals.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { appellantFinalCommentId: { in: appellantFinals.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { appellantProofOfEvidenceId: { in: appellantProofs.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { rule6ProofOfEvidenceSubmissionId: { in: rule6Proofs.map((x) => x.id) } }
		}),
		db.submissionDocumentUpload.deleteMany({
			where: { rule6StatementSubmissionId: { in: rule6Statements.map((x) => x.id) } }
		})
	]);

	await Promise.all([
		db.interestedPartySubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.lPAQuestionnaireSubmission.deleteMany({
			where: { appealCaseReference: caseRef }
		}),
		db.lPAStatementSubmission.deleteMany({ where: { appealCaseReference: caseRef } }),
		db.lPAProofOfEvidenceSubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.lPAFinalCommentSubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.appellantFinalCommentSubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.appellantProofOfEvidenceSubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.rule6ProofOfEvidenceSubmission.deleteMany({ where: { caseReference: caseRef } }),
		db.rule6StatementSubmission.deleteMany({ where: { caseReference: caseRef } })
	]);
}

module.exports = {
	seedDev
};
