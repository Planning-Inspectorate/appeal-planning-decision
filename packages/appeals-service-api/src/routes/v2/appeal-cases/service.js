const {
	ServiceUserRepository,
	ServiceUserType
} = require('#repositories/sql/service-user-repository');
const { AppealCaseRepository } = require('./repo');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { sendSubmissionConfirmationEmailToAppellantV2 } = require('#lib/notify');

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
 * @typedef {import("@prisma/client").AppealCaseRelationship} AppealRelations
 * @typedef {AppealCase & {users?: Array.<ServiceUser>} & {relations?: Array.<AppealRelations>}} AppealCaseDetailed
 * @typedef {import ('pins-data-model').Schemas.AppealHASCase} AppealHASCase
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {AppealCaseDetailed}
 */
const parseJSONFields = (caseData) => {
	return {
		...caseData,
		siteAccessDetails: caseData.siteAccessDetails ? JSON.parse(caseData.siteAccessDetails) : [],
		siteSafetyDetails: caseData.siteSafetyDetails ? JSON.parse(caseData.siteSafetyDetails) : [],
		caseValidationInvalidDetails: caseData.caseValidationInvalidDetails
			? JSON.parse(caseData.caseValidationInvalidDetails)
			: [],
		caseValidationIncompleteDetails: caseData.caseValidationIncompleteDetails
			? JSON.parse(caseData.caseValidationIncompleteDetails)
			: [],
		lpaQuestionnaireValidationDetails: caseData.lpaQuestionnaireValidationDetails
			? JSON.parse(caseData.lpaQuestionnaireValidationDetails)
			: []
	};
};

/**
 * Get an appeal case and appellant by case reference
 *
 * @param {object} opts
 * @param {string} opts.caseReference
 * @returns {Promise<AppealCaseDetailed|null>}
 */
async function getCaseAndAppellant(opts) {
	let appeal = await repo.getByCaseReference(opts);

	if (!appeal) {
		return null;
	}

	appeal = await appendAppellantAndAgent(appeal);
	appeal = await appendAppealRelations(appeal);

	return parseJSONFields(appeal);
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

		let result;
		switch (data.caseType) {
			case CASE_TYPES.HAS.key:
				if (!hasValidator(data)) {
					throw ApiError.badRequest('Payload was invalid');
				}
				result = await repo.putHASByCaseReference(caseReference, CASE_TYPES.HAS.processCode, {
					...data
				});
				break;
			default:
				throw Error(`putCase: unhandled casetype: ${data.caseType}`);
		}

		// send email confirming appeal to user if this creates a new appeal
		if (!result.exists && result.appellantSubmission) {
			// todo: get email address

			const email = await repo.getAppealUserEmailAddress(caseReference);

			if (!email) {
				throw Error(`no user email associated with: ${caseReference}`);
			}
			await sendSubmissionConfirmationEmailToAppellantV2(
				result.appealCase,
				result.appellantSubmission,
				email
			);
		}

		return result.appealCase;
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
 * @returns {Promise<AppealCaseDetailed[]>}
 */
async function listByLpaCodeWithAppellant(options) {
	const appeals = await repo.listByLpaCode(options);

	if (options.withAppellant) {
		await Promise.all(appeals.map(appendAppellantAndAgent));
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
 * @returns {Promise<AppealCaseDetailed[]>}
 */
async function listByPostcodeWithAppellant(options) {
	const appeals = await repo.listByPostCode(options);

	if (options.withAppellant) {
		await Promise.all(appeals.map(appendAppellantAndAgent));
	}

	return appeals;
}

/**
 * Add the service users to an appeal if there are any.
 *
 * @param {AppealCaseDetailed} appeal
 * @returns {Promise<AppealCaseDetailed>}
 */
async function appendAppellantAndAgent(appeal) {
	// find appeal users by roles
	const serviceUsers = await serviceUserRepo.getForCaseAndType(appeal.caseReference, [
		ServiceUserType.Appellant,
		ServiceUserType.Agent
	]);
	if (!serviceUsers) {
		return appeal;
	}
	appeal.users = serviceUsers;
	return appeal;
}

/**
 * Add the relations to an appeal.
 *
 * @param {AppealCaseDetailed} appeal
 * @returns {Promise<AppealCaseDetailed>}
 */
async function appendAppealRelations(appeal) {
	const relations = await repo.getRelatedCases({ caseReference: appeal.caseReference });
	if (!relations || !relations.length) {
		return appeal;
	}
	appeal.relations = relations;
	return appeal;
}

module.exports = {
	getCaseAndAppellant,
	putCase,
	listByLpaCodeWithAppellant,
	listByPostcodeWithAppellant,
	appendAppellantAndAgent,
	appendAppealRelations,
	parseJSONFields
};
