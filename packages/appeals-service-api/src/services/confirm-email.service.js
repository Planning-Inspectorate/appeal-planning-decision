const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { sendConfirmEmailAddressEmail, createToken } = require('../lib/notify');

const confirmEmailCreateService = async (appeal) => {
	const token = createToken();
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
						token: token,
						tokenStatus: 'NOT_SENT',
						createdAt: new Date()
					}
				},
				option
			);
	} catch (err) {
		logger.error(err, `Error when creating in the db`);
	}
	return token;
};

const confirmEmailNotifyContinue = async (saved, token) => {
	await sendConfirmEmailAddressEmail(saved, token);
};

const confirmEmailGetService = async (token) => {
	try {
		const foundToken = await mongodb.get().collection('confirmEmail').findOne({ token: token });
		return foundToken;
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
