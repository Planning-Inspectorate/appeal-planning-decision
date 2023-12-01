const { getUserByEmail, createUser } = require('../services/appeal-user.service');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function userGet(req, res) {
	let statusCode = 200;
	let body = {};

	try {
		body = await getUserByEmail(req.params.email);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get users: ${error.code} // ${error.message.errors}`);
			statusCode = error.code;
			body = error.message.errors;
		} else {
			logger.error('Error:', error);
			statusCode = 500;
			body = 'An unexpected error occured';
		}
	} finally {
		res.status(statusCode).send(body);
	}
}

/**
 * @type {import('express').Handler}
 */
async function userPost(req, res) {
	let statusCode = 200;
	let body = {};

	try {
		body = await createUser(req.body);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed create: ${error.code} // ${error.message.errors}`);
			statusCode = error.code;
			body = error.message.errors;
		} else {
			logger.error('Error:', error);
			statusCode = 500;
			body = 'An unexpected error occured';
		}
	} finally {
		res.status(statusCode).send(body);
	}
}

module.exports = {
	userGet,
	userPost
};
