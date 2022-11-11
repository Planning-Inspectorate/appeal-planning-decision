const {
	constants: { APPEAL_ID }
} = require('../business-rules/src');
const { BackOfficeRepository } = require('../repositories/back-office/back-office-repository');
const logger = require('../lib/logger');
const ApiError = require('../error/apiError');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const validateFullAppeal = require('../validators/validate-full-appeal');
const { validateAppeal } = require('../validators/validate-appeal');
const { AppealsRepository } = require('../repositories/appeals-repository');

const appealsRepository = new AppealsRepository();
const backOfficeRepository = new BackOfficeRepository();

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

// TODO: Rename to "submitAppeal" or something similar. This is essentially
// committing the appeal stored as part of a user's session into something that will
// be used as part of their appeals process moving forwards (can be viewed by case workers).
const updateAppeal = async (appeal, isFirstSubmission = false) => {
	isValidAppeal(appeal);

	const now = new Date(new Date().toISOString());

	/* eslint no-param-reassign: ["error", { "props": false }] */
	appeal.updatedAt = now;

	if (isFirstSubmission) {
		appeal.submissionDate = now;
	}

	const updatedDocument = await appealsRepository.replace(appeal);

	if (isFirstSubmission) {
		try {
			await backOfficeRepository.save(updatedDocument.value);
		} catch (err) {
			logger.error({ err, appealId: appeal.id }, 'Unable to queue confirmation email to appellant');
		}
		await sendSubmissionConfirmationEmailToAppellant(updatedDocument.value.appeal);
		await sendSubmissionReceivedEmailToLpa(updatedDocument.value.appeal);
	}

	logger.debug(`Updated appeal ${appeal.id}\n`);

	return updatedDocument.value;
};

const isAppealSubmitted = async (appealId) => {
	const appeal = appealsRepository.get(appealId);
	return appeal.state == 'SUBMITTED';
};

module.exports = {
	updateAppeal,
	validateAppeal,
	isAppealSubmitted
};
