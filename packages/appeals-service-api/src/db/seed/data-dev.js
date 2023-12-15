const { pickRandom, datesLastMonth, datesNextMonth } = require('./util');

const pastDates = datesLastMonth();
const futureDates = datesNextMonth();

// some data here so we can reference in multiple places
// IDs have no specific meaning, just valid UUIDs and used for upsert/relations

const appellantOne = {
	id: '29670d0f-c4b4-4047-8ee0-d62b93e91a18',
	email: 'appellant1@planninginspectorate.gov.uk'
};

const appealOne = {
	id: '756d6bfb-dde8-4532-a041-86c226a23a07'
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
	appellantOne
];

/**
 * @type {import('@prisma/client').Prisma.AppealCreateInput[]}
 */
const appeals = [
	{
		id: appealOne.id
	},
	{
		id: appealSubmissionDraft.id,
		legacyAppealSubmissionId: appealSubmissionDraft.id,
		legacyAppealSubmissionState: 'DRAFT'
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]}
 */
const appealCases = [
	{
		Appeal: {
			connect: { id: appealOne.id }
		},
		caseReference: '1010101',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		outcome: 'allowed',
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: '123 Fake Street',
		siteAddressTown: 'Testville',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(futureDates)
	}
];

/**
 * Link users to appeals
 *
 * @type {{appealId: string, userId: string, role: string}[]}
 */
const appealToUsers = [
	{
		appealId: appealOne.id,
		userId: appellantOne.id,
		role: 'appellant'
	},
	{
		appealId: appealSubmissionDraft.id,
		userId: appellantOne.id,
		role: 'appellant'
	}
];

/**
 * @type {import('@prisma/client').Prisma.ServiceUserCreateInput[]}
 */
const serviceUsers = [
	{
		internalId: '19d01551-e0cb-414f-95d9-fd71422c9a80',
		id: '12345',
		serviceUserType: 'Appellant',
		caseReference: '1010101',
		firstName: 'Appellant',
		lastName: 'One'
	},
	{
		internalId: '90e7e328-0631-4373-8bd6-0d431b736120',
		id: '12346',
		serviceUserType: 'Agent',
		caseReference: '1010101',
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

	// create some appeal cases
	for (const appealCase of appealCases) {
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
