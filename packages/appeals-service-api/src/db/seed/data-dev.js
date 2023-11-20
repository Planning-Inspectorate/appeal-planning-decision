/**
 * @type {import('@prisma/client').Prisma.AppealUserCreateInput}
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
 * @param {import('@prisma/client')} dbClient
 */
async function seedDev(dbClient) {
	for (const user of users) {
		await dbClient.appealUser.upsert({
			create: user,
			update: user,
			where: { email: user.email }
		});
	}
	// todo: seed more data needed for local dev
	console.log('dev seed complete');
}

module.exports = {
	seedDev
};
