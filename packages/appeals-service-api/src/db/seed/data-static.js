/**
 * @typedef { 'appellant' | 'agent' | 'interestedParty' } AppealToUserRoles
 * @typedef {import('@prisma/client').Prisma.AppealToUserRoleCreateInput} AppealToUserRoleCreateInput
 */

/**
 * @type {Object<string, AppealToUserRoleCreateInput>}
 */
const APPEAL_USER_ROLES = {
	appellant: {
		name: 'appellant',
		description: `Appellant is the person who's planning application decision is being appealed`
	},
	agent: {
		name: 'agent',
		description: `An agent is a user who submits an appeal on behalf of an appellant`
	},
	interestedParty: {
		name: 'interestedParty',
		description: `An interested party is a user who submits a comment on an appeal`
	},
	rule6Party: {
		name: 'rule-6-party',
		description: '' /* TODO: I forgot what this is, sorry! */
	}
};

const APPEAL_USER_ROLES_ARRAY = Object.values(APPEAL_USER_ROLES);

/**
 * @param {import('@prisma/client').PrismaClient} dbClient
 */
async function seedStaticData(dbClient) {
	for (const role of APPEAL_USER_ROLES_ARRAY) {
		await dbClient.appealToUserRole.upsert({
			create: role,
			update: role,
			where: { name: role.name }
		});
	}
	console.log('static data seed complete');
}

module.exports = {
	seedStaticData,
	APPEAL_USER_ROLES,
	APPEAL_USER_ROLES_ARRAY
};
