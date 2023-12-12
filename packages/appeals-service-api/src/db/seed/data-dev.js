const { pickRandom, datesLastMonth, datesNextMonth } = require('./util');

const pastDates = datesLastMonth();
const futureDates = datesNextMonth();

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
	}
];

/**
 * @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]}
 */
const appeals = [
	{
		Appeal: {
			connectOrCreate: {
				where: { id: '756d6bfb-dde8-4532-a041-86c226a23a07' },
				create: {}
			}
		},
		caseReference: '1010101',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
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
	for (const user of users) {
		await dbClient.appealUser.upsert({
			create: user,
			update: user,
			where: { email: user.email }
		});
	}
	for (const appeal of appeals) {
		await dbClient.appealCase.upsert({
			create: appeal,
			update: appeal,
			where: { caseReference: appeal.caseReference }
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
