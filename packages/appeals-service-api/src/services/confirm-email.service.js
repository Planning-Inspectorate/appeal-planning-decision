const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { sendConfirmEmailAddressEmail } = require('../lib/notify');

const confirmEmailCreateService = async (appeal) => {
	const appealId = { appealId: appeal.id };
	const option = { upsert: true };
	try {
		await mongodb
			.get()
			.collection('confirmEmail')
			.updateOne(
				appealId,
				{
					$set: {
						createdAt: new Date()
					}
				},
				option
			);
	} catch (err) {
		logger.error(err, `Error when creating in the db`);
	}
	return appeal.id;
};

const confirmEmailNotifyContinue = async (saved) => {
	await sendConfirmEmailAddressEmail(saved);
};

const confirmEmailGetService = async (appealId) => {
	try {
		const saved = await mongodb.get().collection('confirmEmail').findOne({ appealId: appealId });
		return saved;
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

module.exports = {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
};
