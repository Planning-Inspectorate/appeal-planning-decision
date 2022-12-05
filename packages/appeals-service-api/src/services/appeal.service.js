// TODO: the functions here shouldn't be sending API responses since they shouldnt know
// they're being invoked in the context of a web request. These responses should be sent
// in the relevant router.
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const validateFullAppeal = require('../validators/validate-full-appeal');
const { validateAppeal } = require('../validators/validate-appeal');
const { BackOfficeRepository } = require('../repositories/back-office-repository');
const { AppealsRepository } = require('../repositories/appeals-repository');
const uuid = require('uuid');
const { HorizonService } = require('./horizon.service');

const appealsRepository = new AppealsRepository();
const backOfficeRepository = new BackOfficeRepository();
const horizonService = new HorizonService();

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

/**
 * Will submit the appeal with `id` specified to the Back Office system, iff 
 * @param {string} id 
 */
async function submitToBackOffice(id) {
	logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);

    const savedAppealEntity = await appealsRepository.getById(id);
    if (savedAppealEntity === null) {
        throw ApiError.appealNotFound(id);
	}

	let appeal = savedAppealEntity.appeal;
	logger.debug(`Appeal found in repository: ${JSON.stringify(appeal)}`);

	const appealInBackOffice = await horizonService.getAppeal(appeal.horizonId);
	if ( (appeal.horizonId && appealInBackOffice) == false) {
		appeal.submissionDate = new Date(new Date().toISOString());
		appeal.state = 'SUBMITTED'
		const updatedAppealEntity = await appealsRepository.update(appeal);
		const updatedAppeal = updatedAppealEntity.value;
		backOfficeRepository.create(updatedAppeal);
		// TODO: put the next two function calls in the Horizon Azure function when we have 
		// DEFINITE confirmation that the appeal has been submitted
		await sendSubmissionConfirmationEmailToAppellant(updatedAppeal.appeal);
		await sendSubmissionReceivedEmailToLpa(updatedAppeal.appeal);
		return updatedAppeal.appeal;
	} else {
		logger.debug('Appeal has already been submitted to the back-office');
		throw ApiError.appealAlreadySubmitted();
	}
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	validateAppeal,
	submitToBackOffice
};
