const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const { lpaAppealCaseData, lpaAppeals } = require('./lpa-appeal-case-data-dev');

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

const appealIds = {
	appealOne: '756d6bfb-dde8-4532-a041-86c226a23a01',
	appealTwo: '756d6bfb-dde8-4532-a041-86c226a23a02',
	appealThree: '756d6bfb-dde8-4532-a041-86c226a23a03',
	appealFour: '756d6bfb-dde8-4532-a041-86c226a23a04',
	appealFive: '756d6bfb-dde8-4532-a041-86c226a23a05',
	appealSix: '756d6bfb-dde8-4532-a041-86c226a23a06',
	appealSeven: '756d6bfb-dde8-4532-a041-86c226a23a07',
	appealEight: '756d6bfb-dde8-4532-a041-86c226a23a08'
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

const appealSubmissionDraft = {
	// ID in Cosmos, see dev/data
	id: '89aa8504-773c-42be-bb68-029716ad9756'
};

/**
 * @type {import('@prisma/client').Prisma.AppealUserCreateInput[]}
 */
const users = [
	{
		email: 'user1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: false,
		lpaCode: 'Q9999',
		lpaStatus: 'added'
	},
	{
		email: 'admin1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: true,
		lpaCode: 'Q9999',
		lpaStatus: 'confirmed'
	},
	appellants.appellantOne,
	appellants.appellantTwo,
	appellants.appellantThree,
	appellants.appellantFour,
	appellants.appellantFive,
	appellants.appellantSix,
	appellants.appellantSeven,
	appellants.appellantEight
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
	{
		id: appealSubmissionDraft.id,
		legacyAppealSubmissionId: appealSubmissionDraft.id,
		legacyAppealSubmissionState: 'DRAFT'
	}
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
	costsAppliedForIndicator: false
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
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1))
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
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(2))
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
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(1))
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
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2))
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
		caseDecisionDate: pickRandom(datesNMonthsAgo(1))
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
		caseDecisionDate: pickRandom(datesNMonthsAgo(2))
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
		caseDecisionDate: pickRandom(datesNMonthsAgo(3))
	},
	{
		Appeal: {
			connect: { id: appealIds.appealEight }
		},
		...commonAppealProperties,
		caseReference: caseReferences.caseReferenceEight,
		decision: 'other',
		originalCaseDecisionDate: pickRandom(datesNMonthsAgo(1)),
		LPAApplicationReference: '12/2323238/PLA',
		questionnaireDueDate: pickRandom(datesNMonthsAgo(2)),
		interestedPartyRepsDueDate: pickRandom(datesNMonthsAgo(2)),
		caseDecisionDate: pickRandom(datesNMonthsAgo(4))
	}
];

/**
 * Link users to appeals
 *
 * @type {{appealId: string, userId: string, role: string}[]}
 */
const appealToUsers = [
	{
		appealId: appealIds.appealOne,
		userId: appellants.appellantOne.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealTwo,
		userId: appellants.appellantTwo.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealThree,
		userId: appellants.appellantThree.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealFour,
		userId: appellants.appellantFour.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealFive,
		userId: appellants.appellantFive.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealSix,
		userId: appellants.appellantSix.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealSeven,
		userId: appellants.appellantSeven.id,
		role: 'appellant'
	},
	{
		appealId: appealIds.appealEight,
		userId: appellants.appellantEight.id,
		role: 'appellant'
	},
	{
		appealId: appealSubmissionDraft.id,
		userId: appellants.appellantOne.id,
		role: 'appellant'
	}
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

	for (const appeal of lpaAppeals) {
		await dbClient.appeal.upsert({
			create: appeal,
			update: appeal,
			where: { id: appeal.id }
		});
	}

	// create some appeal cases
	for (const appealCase of appealCases) {
		await dbClient.appealCase.upsert({
			create: appealCase,
			update: appealCase,
			where: { caseReference: appealCase.caseReference }
		});
	}

	for (const appealCase of lpaAppealCaseData) {
		await dbClient.appealCase.upsert({
			create: appealCase,
			update: appealCase,
			where: { caseReference: appealCase.caseReference }
		});
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

	// todo: link some appellant/agent users to some appeals

	// todo: seed more data needed for local dev
	console.log('dev seed complete');
}

module.exports = {
	seedDev
};
