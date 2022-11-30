const logger = require('../lib/logger');
const mongodb = require('../db/db');
const {
	sendSaveAndReturnContinueWithAppealEmail,
	sendSaveAndReturnEnterCodeIntoServiceEmail,
	createToken
} = require('../lib/notify');
const { getAppeal } = require('./appeal.service');

const saveAndReturnCreateService = async (appeal) => {
	const query = { appealId: appeal.id };
	const option = { upsert: true };
	try {
		await mongodb
			.get()
			.collection('saveAndReturn')
			.updateOne(
				query,
				{
					$set: {
						token: null,
						tokenStatus: 'NOT_SENT',
						appealId: appeal.id,
						createdAt: new Date()
					}
				},
				option
			);
	} catch (err) {
		logger.error(err, `Error when creating in the db`);
	}
	return query;
};

const saveAndReturnGetService = async (appealId) => {
	let saved;
	await mongodb
		.get()
		.collection('saveAndReturn')
		.findOne({ appealId })
		.then((doc) => {
			saved = doc.value;
		})
		.catch((err) => {
			console.log(err);
			throw new Error(err);
		});
	return saved;
};

const saveAndReturnGetServiceToken = async (tokenA) => {
	let saved;
	await mongodb
		.get()
		.collection('saveAndReturn')
		.findOne({ token: tokenA })
		.then((doc) => {
			saved = doc;
		})
		.catch((err) => {
			console.log(err);
			throw new Error(err);
		});
	return saved;
};

const saveAndReturnNotifyContinue = async (saved) => {
	await sendSaveAndReturnContinueWithAppealEmail(saved);
};

const saveAndReturnNotifyCode = async (appeal) => {
	logger.info('APPEAL ID:', appeal.id);
	logger.info('Entering saveAndReturnTokenService...');
	const appealSaveData = await saveAndReturnTokenService(appeal.id);
	logger.info('saveAndReturnTokenService complete');
	logger.info('Entering getAppeal...');
	const savedAppeal = await getAppeal(appeal.id);
	logger.info('getAppeal complete');
	logger.info(`email ${savedAppeal.email}`);
	logger.info(`token: ${appealSaveData.token}`);
	logger.info(`id: ${savedAppeal.id}`);
	//issue is below here:
	await sendSaveAndReturnEnterCodeIntoServiceEmail(
		savedAppeal.email,
		appealSaveData.token,
		savedAppeal.id
	);
};

const saveAndReturnTokenService = async (appealId) => {
	let resSavedAppeal;
	const token = createToken();
	try {
		await mongodb
			.get()
			.collection('saveAndReturn')
			.findOneAndUpdate(
				{ appealId: appealId },
				{
					$set: {
						token: token,
						createdAt: new Date()
					}
				},
				{ returnOriginal: true, upsert: false }
			)
			.then(async () => {
				await mongodb
					.get()
					.collection('saveAndReturn')
					.findOne({ token: { $eq: token } })
					.then((savedAppeal) => {
						resSavedAppeal = savedAppeal;
						logger.debug(resSavedAppeal, 'Saved appeal token sent');
					});
			});
	} catch (err) {
		logger.error(err, `Error when creating in the db`);
	}
	return resSavedAppeal;
};

module.exports = {
	saveAndReturnCreateService,
	saveAndReturnGetService,
	saveAndReturnTokenService,
	saveAndReturnNotifyContinue,
	saveAndReturnNotifyCode,
	saveAndReturnGetServiceToken
};
