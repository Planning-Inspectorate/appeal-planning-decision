const {
	getUsers,
	createUser,
	getUserByEmail,
	getUserById,
	disableUser
} = require('../services/user.service');
const logger = require('../lib/logger');

async function usersGet(req, res) {
	const { lpaCode } = req.query;
	let statusCode = 200;
	let body = {};

	try {
		body = await getUsers(lpaCode);
	} catch (error) {
		logger.error(`Failed to get users: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
}

async function userPost(req, res) {
	let statusCode = 201;
	let body = {};

	try {
		await createUser(req.body);
	} catch (error) {
		logger.error(`Failed to create user: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
}

async function userGet(req, res) {
	let statusCode = 200;
	let body = {};

	try {
		body = await getUserByEmail(req.params.email);
	} catch (error) {
		logger.error(`Failed to get users: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
}

async function userGetById(req, res) {
	let statusCode = 200;
	let body = {};

	try {
		body = await getUserById(req.params.id);
	} catch (error) {
		logger.error(`Failed to get users: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
}

async function userDelete(req, res) {
	let statusCode = 204;
	let body = {};
	try {
		await disableUser(req.params.id);
	} catch (error) {
		logger.error(`Failed to delete user: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
}

module.exports = {
	usersGet,
	userPost,
	userGet,
	userGetById,
	userDelete
};