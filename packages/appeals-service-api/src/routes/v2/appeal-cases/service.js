const {
	ServiceUserRepository,
	ServiceUserType
} = require('#repositories/sql/service-user-repository');
const { AppealCaseRepository } = require('./repo');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const { CASE_TYPES } = require('@pins/database/src/seed/data-static');

const repo = new AppealCaseRepository();
const serviceUserRepo = new ServiceUserRepository();
const { SchemaValidator } = require('../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();

/**
 * @template Payload
 * @typedef {import('../../../services/back-office-v2/validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import('@prisma/client').Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import("@prisma/client").ServiceUser} ServiceUser
 * @typedef {AppealCase & {appellant?: ServiceUser}} AppealCaseWithAppellant
 * @typedef {import ('pins-data-model').Schemas.AppealHASCase} AppealHASCase

 */

/**
 * Get an appeal case and appellant by case reference
 *
 * @param {object} opts
 * @param {string} opts.caseReference
 * @returns {Promise<AppealCaseWithAppellant|null>}
 */
async function getCaseAndAppellant(opts) {
	const appeal = await repo.getByCaseReference(opts);

	if (!appeal) {
		return null;
	}

	return await appendAppellant(appeal);
}

/**
 * Get an appeal case and appellant by case reference
 *
 * @param {string} caseReference
 * @param {AppealHASCase} data
 * @returns {Promise<AppealCase>}
 */
async function putCase(caseReference, data) {
	try {
		/** @type {Validate<AppealHASCase>} */
		const hasValidator = getValidator('appeal-has');

		switch (data.caseType) {
			case CASE_TYPES.HAS.key:
				// todo: openApiValidatorMiddleware not working?
				if (!hasValidator(data)) {
					throw ApiError.badRequest('Payload was invalid');
				}

				return repo.putHASByCaseReference(caseReference, CASE_TYPES.HAS.processCode, { ...data });
			default:
				throw Error(`putCase: unhandled casetype: ${data.caseType}`);
		}
	} catch (err) {
		if (err instanceof PrismaClientValidationError) {
			throw ApiError.badRequest(err.message);
		}
		throw err;
	}
}

/**
 * List cases for an LPA
 *
 * @param {Object} options
 * @param {string} options.lpaCode
 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
 * @param {boolean} options.withAppellant - if true, include the appellant if available
 * @returns {Promise<AppealCaseWithAppellant[]>}
 */
async function listByLpaCodeWithAppellant(options) {
	const appeals = await repo.listByLpaCode(options);

	if (options.withAppellant) {
		await Promise.all(appeals.map(appendAppellant));
	}

	return appeals;
}

/**
 * List cases by postcode
 *
 * @param {Object} options
 * @param {string} options.postcode
 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
 * @param {boolean} options.withAppellant - if true, include the appellant if available
 * @returns {Promise<AppealCaseWithAppellant[]>}
 */
async function listByPostcodeWithAppellant(options) {
	const appeals = await repo.listByPostCode(options);

	if (options.withAppellant) {
		await Promise.all(appeals.map(appendAppellant));
	}

	return appeals;
}

/**
 * Add the appellant field to an appeal if there is one.
 *
 * @param {AppealCaseWithAppellant} appeal
 * @returns {Promise<AppealCaseWithAppellant>}
 */
async function appendAppellant(appeal) {
	// find appellant
	const serviceUsers = await serviceUserRepo.getForCaseAndType(
		appeal.caseReference,
		ServiceUserType.Appellant
	);
	if (!serviceUsers || serviceUsers.length !== 1) {
		return appeal;
	}
	appeal.appellant = serviceUsers[0];
	return appeal;
}

module.exports = {
	getCaseAndAppellant,
	putCase,
	listByLpaCodeWithAppellant,
	listByPostcodeWithAppellant,
	appendAppellant
};
