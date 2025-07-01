const {
	APPEAL_TO_USER_ROLES,
	CASE_TYPES,
	PROCEDURE_TYPES,
	LPA_NOTIFICATION_METHODS,
	CASE_STATUSES,
	CASE_OUTCOMES,
	CASE_VALIDATION_OUTCOMES,
	LPAQ_VALIDATION_OUTCOMES
} = require('@pins/common/src/database/data-static');

const APPEAL_USER_ROLES_ARRAY = Object.values(APPEAL_TO_USER_ROLES);
const CASE_TYPES_ARRAY = Object.values(CASE_TYPES).map((caseType) => ({
	id: caseType.id,
	key: caseType.key,
	type: caseType.type,
	processCode: caseType.processCode
}));
const PROCEDURE_TYPES_ARRAY = Object.values(PROCEDURE_TYPES);
const LPA_NOTIFICATION_METHODS_ARRAY = Object.values(LPA_NOTIFICATION_METHODS);
const CASE_STATUSES_ARRAY = Object.values(CASE_STATUSES);
const CASE_OUTCOMES_ARRAY = Object.values(CASE_OUTCOMES);
const CASE_VALIDATION_OUTCOMES_ARRAY = Object.values(CASE_VALIDATION_OUTCOMES);
const LPAQ_VALIDATION_OUTCOMES_ARRAY = Object.values(LPAQ_VALIDATION_OUTCOMES);

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
			where: { id: caseType.id }
		});
	}
	for (const procedure of PROCEDURE_TYPES_ARRAY) {
		await dbClient.procedureType.upsert({
			create: procedure,
			update: procedure,
			where: { key: procedure.key }
		});
	}
	for (const method of LPA_NOTIFICATION_METHODS_ARRAY) {
		await dbClient.lPANotificationMethods.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}
	for (const method of CASE_STATUSES_ARRAY) {
		await dbClient.caseStatus.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}
	for (const method of CASE_OUTCOMES_ARRAY) {
		await dbClient.caseDecisionOutcome.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}
	for (const method of CASE_VALIDATION_OUTCOMES_ARRAY) {
		await dbClient.caseValidationOutcome.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}
	for (const method of LPAQ_VALIDATION_OUTCOMES_ARRAY) {
		await dbClient.lPAQuestionnaireValidationOutcome.upsert({
			create: method,
			update: method,
			where: { key: method.key }
		});
	}

	console.log('static data seed complete');
}

module.exports = {
	seedStaticData,
	APPEAL_USER_ROLES_ARRAY
};
