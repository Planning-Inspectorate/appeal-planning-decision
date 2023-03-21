const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { createToken } = require('../lib/token');

const createOrUpdateTokenDocument = async (id) => {
	const token = createToken();
	try {
		await mongodb
			.get()
			.collection('securityToken')
			.findOneAndUpdate(
				{ _id: id },
				{
					$set: {
						id,
						token,
						createdAt: new Date()
					}
				},
				{ upsert: true }
			);
	} catch (err) {
		logger.error(err, `Error: security token not updated`);
	}
	return token;
};

const getTokenDocumentIfExists = async (id, token) => {
	let saved;
	await mongodb
		.get()
		.collection('securityToken')
		.findOne({
			id,
			token
		})
		.then((doc) => {
			saved = doc;
		})
		.catch((err) => {
			logger.error(err, `Error: error when checking security token`);
			throw new Error(err);
		});
	return saved;
};

module.exports = {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists
};
