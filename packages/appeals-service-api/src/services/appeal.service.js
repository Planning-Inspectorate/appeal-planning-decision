const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const mongodb = require('../db/db');
const queue = require('../lib/queue');
const logger = require('../lib/logger');
const ApiError = require('../error/apiError');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const validateFullAppeal = require('../validators/validate-full-appeal');
const { validateAppeal } = require('../validators/validate-appeal');

const APPEALS = 'appeals';

const getAppeal = async (id) => {
	return mongodb.get().collection(APPEALS).findOne({ _id: id });
};

const insertAppeal = async (appeal) => {
	return mongodb.get().collection('appeals').insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
};

const replaceAppeal = async (appeal) => {
	return mongodb
		.get()
		.collection(APPEALS)
		.findOneAndUpdate(
			{ _id: appeal.id },
			{ $set: { uuid: appeal.id, appeal } },
			{ returnOriginal: false, upsert: false }
		);
};

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

const updateAppeal = async (appeal, isFirstSubmission = false) => {
	isValidAppeal(appeal);

	const now = new Date(new Date().toISOString());

	/* eslint no-param-reassign: ["error", { "props": false }] */
	appeal.updatedAt = now;

	if (isFirstSubmission) {
		appeal.submissionDate = now;
	}

	const updatedDocument = await replaceAppeal(appeal);

	if (isFirstSubmission) {
		try {
			await queue.addAppeal(updatedDocument.value);
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
	return mongodb
		.get()
		.collection(APPEALS)
		.find({ _id: appealId, 'appeal.state': 'SUBMITTED' })
		.limit(1)
		.count()
		.then((n) => {
			return n === 1;
		});
};

module.exports = {
	getAppeal,
	insertAppeal,
	updateAppeal,
	validateAppeal,
	isAppealSubmitted,
	replaceAppeal
};
