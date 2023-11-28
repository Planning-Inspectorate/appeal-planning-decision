const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { createToken } = require('../lib/token');
const TokenRepository = require('../../src/repositories/sql/token-repository.js');

/**
 *  @typedef { import("@prisma/client").SecurityToken } SecurityToken
 */

const tokenRepo = new TokenRepository();

/**
 * create or update the token using sql
 * @param {string} appealUserId - id of appeal user
 * @param {string} action - action token is used for
 * @returns {Promise<string>}
 */
const createOrUpdateToken = async (appealUserId, action) => {
	const token = createToken();
	await tokenRepo.create(appealUserId, action, token);
	return token;
};

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
 * look up token in sql by id and update attempts count
 * @param {string} appealUserId - user the token is associated with
 * @returns {Promise<null|SecurityToken>}
 */
const getTokenIfExists = async (appealUserId) => {
	const sqlToken = tokenRepo.getByUserId(appealUserId);
	if (sqlToken) {
		return sqlToken;
	}

	return null;
};

/**
 * look up token in mongo by id and update attempts count
 * @param {string} id - id the token is associated with, appeal/user
 * @returns {Promise<any>}
 */
const getTokenDocumentIfExists = async (id) => {
	let saved = null;

	// fallback to mongo
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
 * @param {string} appealUserId
 * @returns {Promise<Date|undefined>}
 */
const getTokenCreatedAt = (appealUserId) => {
	return tokenRepo.getCreatedDate(appealUserId);
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
	createOrUpdateToken,
	createOrUpdateTokenDocument,
	getTokenIfExists,
	getTokenDocumentIfExists,
	getTokenCreatedAt,
	getTokenDocumentCreatedAt
};
