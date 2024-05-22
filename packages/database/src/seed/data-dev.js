const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const { lpaAppealCaseData, lpaAppeals } = require('./lpa-appeal-case-data-dev');
const { appealDocuments } = require('./appeal-documents-dev');
const {
	constants: { DECISION_OUTCOME }
} = require('@pins/business-rules');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const config = require('../configuration/config.js');

// some data here so we can reference in multiple places
// IDs have no specific meaning, just valid UUIDs and used for upsert/relations

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
		lpaCode: 'Q9999',
		lpaStatus: 'added'
	},
	lpaAdmin: {
		id: '3e0b7bc5-c91a-456c-b36d-260b2a52aa70',
		email: 'admin1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: true,
		lpaCode: 'Q9999',
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
	appealTen: 'f933b0e0-1694-11ef-ab42-cbf3edc5e3fd'
};

const caseReferences = {
	caseReferenceOne: '1010101',
	caseReferenceTwo: '1010102',
	caseReferenceThree: '1010103',
	caseReferenceFour: '1010104',
	caseReferenceFive: '1010105',
	caseReferenceSix: '1010106',
	caseReferenceSeven: '1010107',
	caseReferenceEight: '1010108'
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

const rule6Documents = {
	proofEvidenceSubmitted: false,
	proofEvidenceReceived: false,
	statementDocuments: false,
	witnesses: false,
	statementSubmitted: false,
	statementReceived: false
};

const rule6PartyGroups = [
	{
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91c11',
		caseReference: caseReferences.caseReferenceOne,
		firstName: 'Group',
		lastName: '1',
		over18: true,
		partyName: 'Group 1',
		partyEmail: rule6Parties.r6One.email,
		addressLine1: '321 Fake Street',
		partyStatus: 'confirmed',
		...rule6Documents,
		appealUserId: rule6Parties.r6One.id
	},
	{
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91c12',
		caseReference: caseReferences.caseReferenceTwo,
		firstName: 'Group',
		lastName: '2',
		over18: true,
		partyName: 'Group 2',
		partyEmail: rule6Parties.r6Two.email,
		addressLine1: '321 Fake Street',
		partyStatus: 'confirmed',
		...rule6Documents,
		statementReceived: true,
		appealUserId: rule6Parties.r6Two.id
	},
	{
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91c13',
		caseReference: caseReferences.caseReferenceThree,
		firstName: 'Group',
		lastName: '3',
		over18: true,
		partyName: 'Group 3',
		partyEmail: rule6Parties.r6Three.email,
		addressLine1: '321 Fake Street',
		partyStatus: 'confirmed',
		...rule6Documents,
		statementReceived: true,
		proofEvidenceReceived: true,
		appealUserId: rule6Parties.r6Three.id
	},
	{
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91c14',
		caseReference: caseReferences.caseReferenceThree,
		firstName: 'Group',
		lastName: '4',
		over18: true,
		partyName: 'Group 4',
		partyEmail: rule6Parties.r6Four.email,
		addressLine1: '321 Fake Street',
		partyStatus: 'confirmed',
		...rule6Documents,
		statementReceived: true,
		proofEvidenceReceived: true,
		appealUserId: rule6Parties.r6Four.id
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealUserCreateInput[]}
 */
const users = [
	lpaUsers.lpaUser,
	lpaUsers.lpaAdmin,
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
	LPACode: 'Q9999',
	LPAName: 'System Test Borough Council',
	appealTypeCode: 'HAS',
	appealTypeName: 'Householder',
	siteAddressLine1: '123 Fake Street',
	siteAddressTown: 'Testville',
	siteAddressCounty: 'Countyshire',
	siteAddressPostcode: 'BS1 6PN',
	costsAppliedForIndicator: false,
	casePublished: true
};

/**
 * @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]}
 */
const appealCases = [
	{
		Appeal: {
			connect: { id: appealIds.appealOne }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceOne,
		decision: '',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323231/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
		procedure: 'Inquiry',
		appellantFirstName: 'Test',
		appellantLastName: 'Appellant 1',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublished: true,
		appealValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		lpaQuestionnaireSubmitted: true,
		caseReceived: true,
		caseValidDate: new Date(),
		lpaQuestionnairePublishedDate: new Date(),
		lpaStatementPublished: true,
		rule6StatementPublished: true,
		proofsOfEvidenceDueDate: pickRandom(datesNMonthsAhead(2)),
		interestedPartyCommentsPublished: true,
		// questionnaire details
		// constraints
		correctAppealType: true,
		changesListedBuilding: false,
		affectsListedBuilding: false,
		scheduledMonument: false,
		conservationArea: false,
		uploadConservation: null,
		protectedSpecies: false,
		greenBelt: false,
		areaOutstandingBeauty: false,
		designatedSites: 'None',
		treePreservationOrder: false,
		uploadTreePreservationOrder: null,
		gypsyTraveller: true,
		publicRightOfWay: false,
		// environmental
		environmentalImpactSchedule: 'no',
		sensitiveArea: false,
		columnTwoThreshold: false,
		screeningOpinion: false,
		requiresEnvironmentalStatement: false,
		// notified
		uploadWhoNotified: true,
		uploadPressAdvert: true,
		// consultations
		statutoryConsultees: false,
		consultationResponses: false,
		otherPartyRepresentations: false,
		// planning officer reports
		uploadPlanningOfficerReport: null,
		emergingPlan: false,
		supplementaryPlanningDocs: false,
		infrastructureLevy: true,
		uploadInfrastructureLevy: null,
		infrastructureLevyAdopted: false,
		infrastructureLevyExpectedDate: new Date(Date.now()),
		// site access
		lpaSiteAccess: false,
		neighbouringSiteAccess: false,
		addNeighbouringSiteAccess: true,
		lpaSiteSafetyRisks: false,
		// appeal process
		lpaProcedurePreference: 'inquiry',
		lpaPreferInquiryDetails: 'Example preference',
		lpaPreferInquiryDuration: '6',
		nearbyAppeals: true,
		newConditions: true,
		newConditionDetails: 'Example new conditions'
	},
	{
		Appeal: {
			connect: { id: appealIds.appealTwo }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceTwo,
		decision: '',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(2)),
		LPAApplicationReference: '12/2323232/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAhead(2)),
		procedure: 'Inquiry',
		appellantFirstName: 'Test',
		appellantLastName: 'Appellant 2',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublished: true,
		appealValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		lpaQuestionnaireSubmitted: true,
		caseReceived: true,
		lpaQuestionnairePublishedDate: new Date(),
		caseValidDate: new Date(),
		lpaStatementPublished: true,
		rule6StatementPublished: true,
		interestedPartyCommentsPublished: true,
		appellantProofEvidencePublished: true,
		lpaProofEvidencePublished: true,
		rule6ProofsEvidencePublished: true
	},
	{
		Appeal: {
			connect: { id: appealIds.appealThree }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceThree,
		decision: '',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323233/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(1)),
		procedure: 'Inquiry',
		appellantFirstName: 'Test',
		appellantLastName: 'Appellant 3',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublished: true,
		appealValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		lpaQuestionnaireSubmitted: true,
		caseReceived: true,
		lpaQuestionnairePublishedDate: new Date(),
		lpaStatementPublished: true,
		caseValidDate: new Date(),
		rule6StatementPublished: true,
		interestedPartyCommentsPublished: true,
		appellantProofEvidencePublished: true,
		lpaProofEvidencePublished: true,
		rule6ProofsEvidencePublished: true,
		caseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		caseDecisionOutcome: DECISION_OUTCOME.ALLOWED
	},
	{
		Appeal: {
			connect: { id: appealIds.appealFour }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceFour,
		decision: '',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323234/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		procedure: 'Written representation',
		appellantFirstName: 'Test',
		appellantLastName: 'Appellant 4',
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
		questionnaireReceived: pickRandom(datesNMonthsAgo(1)),
		lpaQuestionnairePublished: true,
		appealValidDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date(),
		lpaQuestionnaireSubmitted: true,
		caseReceived: true,
		lpaStatementPublished: true,
		caseValidDate: new Date(),
		interestedPartyCommentsPublished: true,
		lpaFinalCommentsPublished: true,
		appellantFinalCommentsSubmitted: true
	},
	{
		Appeal: {
			connect: { id: appealIds.appealFive }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceFive,
		decision: 'allowed',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323235/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		casePublished: false
	},
	{
		Appeal: {
			connect: { id: appealIds.appealSix }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceSix,
		decision: 'dismissed',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323236/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionOutcome: DECISION_OUTCOME.DISMISSED
	},
	{
		Appeal: {
			connect: { id: appealIds.appealSeven }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceSeven,
		decision: 'allowed in part',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323237/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionDate: pickRandom(datesNMonthsAgo(3)),
		caseDecisionOutcome: DECISION_OUTCOME.SPLIT_DECISION
	},
	{
		Appeal: {
			connect: { id: appealIds.appealEight }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceEight,
		decision: '',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323238/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionDate: pickRandom(datesNMonthsAgo(4)),
		caseDecisionOutcome: 'other'
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
		lastName: 'One'
	},
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a82',
		id: '123452',
		serviceUserType: 'Appellant',
		caseReference: caseReferences.caseReferenceTwo,
		firstName: 'Appellant',
		lastName: 'Two'
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
		lastName: 'One'
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
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppellantSubmissionCreateInput[]}
 */
const appellantSubmissions = [
	// v2 appellant submissions
	{
		id: appellantSubmissionIds.appellantSubmissionOne,
		LPACode: 'Q9999',
		appealTypeCode: 'HAS',
		Appeal: {
			connect: { id: appealIds.appealOne }
		}
	},
	{
		id: appellantSubmissionIds.appellantSubmissionTwo,
		LPACode: 'Q9999',
		appealTypeCode: 'HAS',
		applicationDecisionDate: new Date(),
		Appeal: {
			connect: { id: appealIds.appealNine }
		}
	},
	{
		id: appellantSubmissionIds.appellantSubmissionThree,
		LPACode: 'Q9999',
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

	for (const caseId of caseIds) {
		for (const document of appealDocuments) {
			document.documentURI = `${config.storage.boEndpoint}/${document.filename}`;

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
		await dbClient.appealToUser.upsert({
			create: appealToUser,
			update: appealToUser,
			where: {
				appealId_userId: {
					appealId: appealId,
					userId: userId
				}
			}
		});
	}
	for (const serviceUser of serviceUsers) {
		await dbClient.serviceUser.upsert({
			create: serviceUser,
			update: serviceUser,
			where: { internalId: serviceUser.internalId }
		});
	}

	for (const rule6PartyGroup of rule6PartyGroups) {
		await dbClient.rule6Party.upsert({
			create: rule6PartyGroup,
			update: rule6PartyGroup,
			where: { id: rule6PartyGroup.id }
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

	// todo: link some appellant/agent users to some appeals

	// todo: seed more data needed for local dev
	console.log('dev seed complete');
}

module.exports = {
	seedDev
};
