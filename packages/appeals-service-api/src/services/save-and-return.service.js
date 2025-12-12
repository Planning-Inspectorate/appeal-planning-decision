const logger = require('../lib/logger.js');
const mongodb = require('../db/db');
const { sendSaveAndReturnContinueWithAppealEmail } = require('../lib/notify');

const createSavedAppealDocument = async (appealId) => {
	try {
		await mongodb
			.get()
			.collection('saveAndReturn')
			.updateOne(
				{ appealId },
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
	let saved;
	await mongodb
		.get()
		.collection('saveAndReturn')
		.findOne({ appealId })
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
