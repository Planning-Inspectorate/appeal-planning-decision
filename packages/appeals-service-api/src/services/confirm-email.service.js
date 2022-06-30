const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { sendConfirmEmailAddressEmail, createToken } = require('../lib/notify');

const confirmEmailCreateService = async () => {
	const token = createToken();
	const option = { upsert: true };
	try {
		await mongodb
			.get()
			.collection('confirmEmail')
			.updateOne(
				{ token: token },
				{
					$set: {
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
	let foundToken;
	await mongodb
		.get()
		.collection('confirmEmail')
		.findOne({ token: token })
		.then((doc) => {
			foundToken = doc;
		})
		.catch((err) => {
			console.log(err);
			throw new Error(err);
		});
	return foundToken;
};

module.exports = {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
};
