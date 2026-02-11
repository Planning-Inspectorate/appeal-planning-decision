// TODO: the functions here shouldn't be sending API responses since they shouldnt know
// they're being invoked in the context of a web request. These responses should be sent
// in the relevant router.
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const {
	AppealsRepository: AppealsCosmosRepository
} = require('../repositories/appeals-repository');
const {
	AppealsRepository: AppealsSQLRepository
} = require('../repositories/sql/appeals-repository');
const { AppealUserRepository } = require('../repositories/sql/appeal-user-repository');
const uuid = require('uuid');
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
	appeal.id = uuid.v4();
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
