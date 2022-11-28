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

const appealsRepository = new AppealsRepository();
const backOfficeRepository = new BackOfficeRepository();

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

async function getAppeal(req, res) {
	const idParam = req.params.id;

	logger.info(`Retrieving appeal ${idParam} ...`);
	try {
		const document = await appealsRepository.getById(idParam);

		if (document === null) {
			throw ApiError.appealNotFound(idParam);
		}

		logger.info(`Appeal ${idParam} retrieved`);
		res.status(200).send(document.appeal);
	} catch (e) {
		if (e instanceof ApiError) {
			logger.info(e.message);
			res.status(e.code).send({ code: e.code, errors: e.message.errors });
			return;
		}
		logger.info(e.message);
		res.status(500).send(`Problem getting the appeal ${idParam}\n${e}`);
	}
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

async function updateAppeal(req, res) {
	const idParam = req.params.id;
	logger.debug(`Updating appeal ${idParam}`, req.body);
	const proposedAppealUpdate = req.body;
	logger.debug({ proposedAppealUpdate }, 'Proposed appeal update');
	
	try {
		const savedAppealEntity = await appealsRepository.getById(idParam);
		
		if (savedAppealEntity === null) {
			throw ApiError.appealNotFound(idParam);
		}
		
		let appeal = savedAppealEntity.appeal;
		const appealStateBeforeUpdate = appeal.state;
		Object.assign(appeal, proposedAppealUpdate)
		isValidAppeal(appeal);
		
		const now = new Date(new Date().toISOString());
		/* eslint no-param-reassign: ["error", { "props": false }] */
		appeal.updatedAt = now;
		let isFirstSubmission = (appealStateBeforeUpdate === 'DRAFT' && appeal.state === 'SUBMITTED')

		if (isFirstSubmission) {
			appeal.submissionDate = now;
		}

		const updatedAppealEntity = await appealsRepository.update(appeal);
		const updatedAppealWithIdUUIDAndAppeal = updatedAppealEntity.value;
		const updatedAppeal = updatedAppealWithIdUUIDAndAppeal.appeal;

		if (isFirstSubmission) {
			try {
				// TODO: I have no idea why we need to send this, rather than just the appeal data :/
				backOfficeRepository.create(updatedAppealWithIdUUIDAndAppeal);
			} catch (err) {
				logger.error(
					{ err, appealId: updatedAppeal.id },
					'Unable to queue confirmation email to appellant'
				);
			}
			await sendSubmissionConfirmationEmailToAppellant(updatedAppeal);
			await sendSubmissionReceivedEmailToLpa(updatedAppeal);
		}

		logger.debug({ updatedAppeal }, 'Updated appeal data in updateAppeal');
		res.status(200).send(updatedAppeal);
	} catch (e) {
		if (e instanceof ApiError) {
			res.status(e.code).send({ code: e.code, errors: e.message.errors });
			return;
		}

		res.status(500).send(`Problem updating appeal ${idParam}\n${e}`);
	}
}

const isAppealSubmitted = async (appealId) => {
	const appeal = appealsRepository.getById(appealId);
	return appeal.state == 'SUBMITTED';
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	validateAppeal,
	isAppealSubmitted
};
