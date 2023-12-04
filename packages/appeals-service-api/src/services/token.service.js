const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { createToken } = require('../lib/token');

/**
 * create or update the token using mongo
 * @param {string} id - id of appeal/user
 * @param {string} action - action token is used for
 * @returns {Promise<string>}
 */
const createOrUpdateTokenDocument = async (id, action) => {
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
						action,
						attempts: 0,
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

/**
 * look up token in mongo by id and update attempts count
 * @param {string} id - id the token is associated with, appeal/user
 * @returns {Promise<any>}
 */
const getTokenDocumentIfExists = async (id) => {
	let saved = null;

	// look up by id and update attempts count
	await mongodb
		.get()
		.collection('securityToken')
		.findOneAndUpdate({ _id: id }, { $inc: { attempts: 1 } }, { returnOriginal: false })
		.then((doc) => {
			saved = doc;
		})
		.catch((err) => {
			logger.error(err, `Error: error when checking security token`);
			throw new Error(err);
		});

	return saved?.value;
};

/**
 * @param {string} id
 * @returns {Promise<Date>}
 */
const getTokenDocumentCreatedAt = async (id) => {
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
	getTokenDocumentCreatedAt
};
