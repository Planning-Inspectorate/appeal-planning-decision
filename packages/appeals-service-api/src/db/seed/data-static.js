/** @typedef { 'appellant' | 'agent' | 'interestedParty' } AppealToUserRoles */

/**
 * @type {Array.<import('@prisma/client').Prisma.AppealToUserRoleCreateInput>}
 */
const appealToUserRoles = [
	{
		name: 'appellant',
		description: `Appellant is the person who's planning application decision is being appealled`
	},
	{
		name: 'agent',
		description: `An agent is a user who submits an appeal on behalf of an appellant`
	},
	{
		name: 'interestedParty',
		description: `An interested party is a user who submits a comment on an appeal`
	}
];

/**
 * @param {import('@prisma/client').PrismaClient} dbClient
 */
async function seedStaticData(dbClient) {
	for (const role of appealToUserRoles) {
		await dbClient.appealToUserRole.upsert({
			create: role,
			update: role,
			where: { name: role.name }
		});
	}
	console.log('static data seed complete');
}

module.exports = {
	seedStaticData
};
