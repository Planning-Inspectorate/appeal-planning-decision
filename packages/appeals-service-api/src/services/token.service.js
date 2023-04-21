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

const getTokenCreatedAt = async (id) => {
	let saved;

	try {
		saved = await mongodb
			.get()
			.collection('securityToken')
			.findOne(
				{
					id: id
				},
				{
					projection: {
						_id: 0,
						createdAt: 1
					}
				}
			);
	} catch (err) {
		logger.error(err, `Error: error checking security token createdAt property`);
		throw new Error(err);
	}

	return saved?.createdAt;
};

module.exports = {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists,
	getTokenCreatedAt
};
