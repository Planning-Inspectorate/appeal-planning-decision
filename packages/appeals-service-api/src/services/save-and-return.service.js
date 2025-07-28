const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { sendSaveAndReturnContinueWithAppealEmail } = require('../lib/notify');
const uuid = require('uuid');

const createSavedAppealDocument = async (appealId) => {
	if (!uuid.validate(appealId)) {
		throw new Error('createSavedAppealDocument: Invalid appealId');
	}

	try {
		await mongodb
			.get()
			.collection('saveAndReturn')
			.updateOne(
				{ appealId: { $eq: appealId } },
				{
					$set: {
						appealId,
						createdAt: new Date()
					}
				},
				{ upsert: true }
			);
	} catch (err) {
		logger.error(err, `Error when creating in the db`);
	}
};

const getSavedAppealDocument = async (appealId) => {
	if (!uuid.validate(appealId)) {
		throw new Error('getSavedAppealDocument: Invalid appealId');
	}

	let saved;
	await mongodb
		.get()
		.collection('saveAndReturn')
		.findOne({ appealId: { $eq: appealId } })
		.then((doc) => {
			saved = doc;
		})
		.catch((err) => {
			logger.error({ err }, 'getSavedAppealDocument');
			throw new Error(err);
		});
	return saved;
};

const sendContinueWithAppealEmail = async (saved) => {
	await sendSaveAndReturnContinueWithAppealEmail(saved);
};

module.exports = {
	createSavedAppealDocument,
	getSavedAppealDocument,
	sendContinueWithAppealEmail
};
