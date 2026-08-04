// TODO: the functions here shouldn't be sending API responses since they shouldnt know
// they're being invoked in the context of a web request. These responses should be sent
// in the relevant router.
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const validateFullAppeal = require('../validators/validate-full-appeal');
const { validateAppeal } = require('../validators/validate-appeal');
const {
	AppealsRepository: AppealsCosmosRepository
} = require('../repositories/appeals-repository');
const {
	AppealsRepository: AppealsSQLRepository
} = require('../repositories/sql/appeals-repository');
const { AppealUserRepository } = require('../repositories/sql/appeal-user-repository');
const { randomUUID } = require('node:crypto');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const appealsCosmosRepository = new AppealsCosmosRepository();
const appealsSQLRepository = new AppealsSQLRepository();
const appealUserRepository = new AppealUserRepository();

/**
 * @typedef {import('src/spec/api-types').AppealSubmission} AppealSubmission
 */

async function createAppeal(req, res) {
	const appeal = {};

	const now = new Date(new Date().toISOString());
	appeal.id = randomUUID();
	appeal.createdAt = now;
	appeal.updatedAt = now;

	logger.debug(`Creating appeal ${appeal.id} ...`);
	logger.debug({ appeal }, 'Appeal data in createAppeal');

	const document = await appealsCosmosRepository.create(appeal);
	const sqlAppeal = await appealsSQLRepository.createAppeal({
		legacyAppealSubmissionId: appeal.id
	});

	if (document.result && document.result.ok) {
		logger.debug(`Appeal ${appeal.id} created`);
		appeal.appealSqlId = sqlAppeal.id;
		res.status(201).send(appeal);
		return;
	}

	logger.error(`Problem while ${appeal.id} created`);
	res.status(500).send(appeal);
}

/**
 * @param {string} id
 * @returns {Promise<AppealSubmission['appeal']>}
 */
async function getAppeal(id) {
	logger.info(`Retrieving appeal ${id} ...`);
	const document = await appealsCosmosRepository.getById(id);

	if (document === null) {
		logger.info(`Appeal ${id} not found`);
		throw ApiError.appealNotFound(id);
	}

	logger.info(`Appeal ${id} retrieved`);
	return document.appeal;
}

function isValidAppeal(appeal) {
	if (!appeal.appealType) {
		return true;
	}

	if (appeal.appealType === APPEAL_ID.ENFORCEMENT_NOTICE || APPEAL_ID.ENFORCEMENT_LISTED_BUILDING) {
		return true;
	}

	let errors;

	// we do not use v1 validators for s20 listed building appeal but we need to validate
	// the object created in before you start journey which may have s20 listed building type
	// so we use full appeal validator in this context
	if (
		appeal.appealType === APPEAL_ID.PLANNING_SECTION_78 ||
		appeal.appealType === APPEAL_ID.PLANNING_LISTED_BUILDING ||
		appeal.appealType === APPEAL_ID.MINOR_COMMERCIAL ||
		appeal.appealType === APPEAL_ID.ADVERTISEMENT ||
		appeal.appealType === APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
	) {
		errors = validateFullAppeal(appeal);
	} else {
		errors = validateAppeal(appeal);
	}

	if (errors.length > 0) {
		logger.debug(`Validated payload for appeal update generated errors:\n ${appeal}\n${errors}`);
		throw ApiError.badRequest({ errors });
	}

	return errors.length === 0;
}

async function updateAppeal(id, appealUpdate) {
	logger.debug(appealUpdate, `Attempting to update appeal with ID ${id} with`);

	const savedAppealEntity = await appealsCosmosRepository.getById(id);

	if (savedAppealEntity === null) {
		throw ApiError.appealNotFound(id);
	}

	let appeal = savedAppealEntity.appeal;

	// set link to user
	await linkToUser(appeal, appealUpdate);

	Object.assign(appeal, appealUpdate);
	isValidAppeal(appeal);

	appeal.updatedAt = new Date(new Date().toISOString());
	const updatedAppealEntity = await appealsCosmosRepository.update(appeal);
	const updatedAppeal = updatedAppealEntity.value.appeal;

	if (Object.hasOwn(appealUpdate, 'state') || Object.hasOwn(appealUpdate, 'decisionDate')) {
		await appealsSQLRepository.updateAppealByLegacyAppealSubmissionId({
			legacyAppealSubmissionId: id,
			legacyAppealSubmissionDecisionDate: appealUpdate.decisionDate,
			legacyAppealSubmissionState: appealUpdate.state
		});
	}

	logger.debug(updatedAppeal, `Appeal updated to`);
	return updatedAppeal;
}

/**
 * @param {string} id
 */
async function deleteAppeal(id) {
	logger.info(`Attempting to delete appeal with ID ${id}`);

	await appealsCosmosRepository.delete(id);

	logger.info(`Appeal ${id} deleted`);
}

/**
 * @param {*} appeal - existing appeal
 * @param {*} appealUpdate - updated appeal
 * @returns {Promise<void>}
 */
async function linkToUser(appeal, appealUpdate) {
	/** @type {import('@pins/common/src/constants').AppealToUserRoles|undefined} */
	let role;

	/**
	 * checks new bool is defined and is different from original bool
	 * @param {boolean|undefined} original
	 * @param {boolean|undefined} update
	 * @returns {boolean}
	 */
	function isBoolChanged(original, update) {
		return update !== undefined && (original === undefined || update !== original);
	}

	const currentIsOrigApplicantS78 = appeal?.contactDetailsSection?.isOriginalApplicant;
	const updateIsOrigApplicantS78 = appealUpdate?.contactDetailsSection?.isOriginalApplicant;
	if (isBoolChanged(currentIsOrigApplicantS78, updateIsOrigApplicantS78)) {
		role = updateIsOrigApplicantS78 ? APPEAL_USER_ROLES.APPELLANT : APPEAL_USER_ROLES.AGENT;
	}

	const currentIsOrigApplicantHAS = appeal?.aboutYouSection?.yourDetails?.isOriginalApplicant;
	const updateIsOrigApplicantHAS = appealUpdate?.aboutYouSection?.yourDetails?.isOriginalApplicant;
	if (isBoolChanged(currentIsOrigApplicantHAS, updateIsOrigApplicantHAS)) {
		role = updateIsOrigApplicantHAS ? APPEAL_USER_ROLES.APPELLANT : APPEAL_USER_ROLES.AGENT;
	}

	if (!role) {
		return;
	}

	const emailAddress = appeal.email ? appeal.email : appealUpdate.email;

	if (!emailAddress) {
		logger.info(`Cannot link user to appeal with no email: ${appealUpdate.id}`);
		return;
	}

	const sqlData = await Promise.all([
		appealUserRepository.getByEmail(emailAddress),
		appealsSQLRepository.getByLegacyId(appealUpdate.id)
	]).catch((err) => {
		logger.error(err);
		throw ApiError.withMessage(500, 'failed to find user or appeal to link');
	});

	const sqlUser = sqlData[0];
	const sqlAppeal = sqlData[1];

	if (!sqlUser) {
		throw ApiError.userNotFound();
	}

	if (!sqlAppeal) {
		throw ApiError.appealNotFound();
	}

	logger.info(`set role: ${role} between user: ${sqlUser.id} and appeal: ${sqlAppeal.id}`);

	await appealUserRepository.linkUserToAppeal(sqlUser.id, sqlAppeal.id, role);
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	deleteAppeal
};
