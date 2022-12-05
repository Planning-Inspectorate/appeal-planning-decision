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
const { AppealsRepository } = require('../repositories/appeals-repository');
const uuid = require('uuid');

const appealsRepository = new AppealsRepository();

async function createAppeal(req, res) {
	const appeal = {};

	const now = new Date(new Date().toISOString());
	appeal.id = uuid.v4();
	appeal.createdAt = now;
	appeal.updatedAt = now;

	logger.debug(`Creating appeal ${appeal.id} ...`);
	logger.debug({ appeal }, 'Appeal data in createAppeal');

	const document = await appealsRepository.create(appeal);

	if (document.result && document.result.ok) {
		logger.debug(`Appeal ${appeal.id} created`);
		res.status(201).send(appeal);
		return;
	}

	logger.error(`Problem while ${appeal.id} created`);
	res.status(500).send(appeal);
}

async function getAppeal(id) {
	logger.info(`Retrieving appeal ${id} ...`);
	const document = await appealsRepository.getById(id);

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

	let errors;

	if (appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
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
	logger.debug(`Attempting to update appeal with ID ${id} with data`, appealUpdate);

	const savedAppealEntity = await appealsRepository.getById(id);

	if (savedAppealEntity === null) {
		throw ApiError.appealNotFound(id);
	}

	let appeal = savedAppealEntity.appeal;
	Object.assign(appeal, appealUpdate);
	isValidAppeal(appeal);

	/* eslint no-param-reassign: ["error", { "props": false }] */
	appeal.updatedAt = new Date(new Date().toISOString());
	const updatedAppealEntity = await appealsRepository.update(appeal);
	const updatedAppeal = updatedAppealEntity.value.appeal;
	logger.debug({ updatedAppeal }, 'Updated appeal data in updateAppeal');
	return updatedAppeal;
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	validateAppeal
};
