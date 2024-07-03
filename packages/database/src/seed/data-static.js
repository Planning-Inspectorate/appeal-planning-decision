const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
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

const CASE_TYPES = {
	HAS: { id: 1001, key: 'D', type: 'Householder', processCode: 'HAS' },
	S78: { id: 1005, key: 'W', type: 'Full Planning', processCode: 'S78' }
	// { id: 1000, key: 'C', type: 'Enforcement notice appeal' },
	// { id: 1002, key: 'F', type: 'Enforcement listed building and conservation area appeal' },
	// { key: 'G', type: 'Discontinuance notice appeal' },
	// { id: 1003, key: 'H', type: 'Advertisement appeal' },
	// { key: 'L', type: 'Community infrastructure levy' },
	// { id: 1004, key: 'Q', type: 'Planning obligation appeal' },
	// { key: 'S', type: 'Affordable housing obligation appeal' },
	// { key: 'V', type: 'Call-in application' },
	// { key: 'X', type: 'Lawful development certificate appeal' },
	// { id: 1006, key: 'Y', type: 'Planned listed building and conservation area appeal' },
	// { id: 1007, key: 'Z', type: 'Commercial (CAS) appeal' }
};
const CASE_TYPES_ARRAY = Object.values(CASE_TYPES);

const PROCEDURE_TYPES = {
	hearing: { key: 'hearing', name: 'Hearing' },
	inquiry: { key: 'inquiry', name: 'Inquiry' },
	written: { key: 'written', name: 'Written' }
};

const PROCEDURE_TYPES_ARRAY = Object.values(PROCEDURE_TYPES);

const LPA_NOTIFICATION_METHODS = [
	{ key: 'notice', name: 'A site notice' },
	{ key: 'letter', name: 'Letter/email to interested parties' },
	{ key: 'press-advert', name: 'A press advert' }
];

const CASE_OUTCOMES = {
	allowed: { key: 'allowed', name: 'Allowed' },
	split_decision: { key: 'split_decision', name: 'Split decision' },
	dismissed: { key: 'dismissed', name: 'Dismissed' },
	invalid: { key: 'invalid', name: 'Invalid' }
};

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
	for (const caseType of CASE_TYPES_ARRAY) {
		await dbClient.caseType.upsert({
			create: caseType,
			update: caseType,
			where: { key: caseType.key }
		});
	}
	for (const procedure of PROCEDURE_TYPES_ARRAY) {
		await dbClient.procedureType.upsert({
			create: procedure,
			update: procedure,
			where: { key: procedure.key }
		});
	}
	for (const method of LPA_NOTIFICATION_METHODS) {
		await dbClient.lPANotificationMethods.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}
	console.log('static data seed complete');
}

module.exports = {
	seedStaticData,
	APPEAL_TO_USER_ROLES,
	APPEAL_USER_ROLES_ARRAY,
	CASE_TYPES,
	PROCEDURE_TYPES,
	CASE_OUTCOMES
};
