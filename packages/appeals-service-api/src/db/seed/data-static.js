const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef { 'appellant' | 'agent' | 'interestedParty' | 'rule-6-party' } AppealToUserRoles
 * @typedef {import('@prisma/client').Prisma.AppealToUserRoleCreateInput} AppealToUserRoleCreateInput
 */

/**
 * @type {Object<string, AppealToUserRoleCreateInput>}
 */
const APPEAL_TO_USER_ROLES = {
	appellant: {
		name: APPEAL_USER_ROLES.APPELLANT,
		description: `Appellant is the person who's planning application decision is being appealed`
	},
	agent: {
		name: APPEAL_USER_ROLES.AGENT,
		description: `An agent is a user who submits an appeal on behalf of an appellant`
	},
	interestedParty: {
		name: APPEAL_USER_ROLES.INTERESTED_PARTY,
		description: `An interested party is a user who submits a comment on an appeal`
	},
	rule6Party: {
		name: APPEAL_USER_ROLES.RULE_6_PARTY,
		description: `A rule 6 party is a group who are considered a main party for an appeal`
	}
};

const APPEAL_USER_ROLES_ARRAY = Object.values(APPEAL_TO_USER_ROLES);

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
	APPEAL_TO_USER_ROLES,
	APPEAL_USER_ROLES_ARRAY
};
