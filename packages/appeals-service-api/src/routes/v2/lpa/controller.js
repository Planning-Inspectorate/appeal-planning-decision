const ApiError = require('#errors/apiError');
const logger = require('#lib/logger.js');
const service = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.getAll = async (req, res) => {
	try {
		const result = await service.getAll();
		res.status(200).send(result);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err }, 'error getting LPA List');
		throw ApiError.withMessage(500, 'unexpected error');
	}
};

/**
 * @type {import('express').RequestHandler}
 */
exports.getById = async (req, res) => {
	if (!req.params.id) {
		throw ApiError.badRequest('No LPA id provided');
	}

	const id = req.params.id;

	try {
		const result = await service.get(id, null, null);
		res.status(200).send(result);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err, id }, 'error getting LPA');
		throw ApiError.withMessage(500, 'unexpected error');
	}
};

/**
 * @type {import('express').RequestHandler}
 */
exports.getBylpaCode = async (req, res) => {
	if (!req.params.lpaCode) {
		throw ApiError.badRequest('No LPA code provided');
	}

	const lpaCode = req.params.lpaCode;

	try {
		const result = await service.get(null, lpaCode, null);
		res.status(200).send(result);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err, lpaCode }, 'error getting LPA code');
		throw ApiError.withMessage(500, 'unexpected error');
	}
};

/**
 * @type {import('express').RequestHandler}
 */
exports.getBylpa19CD = async (req, res) => {
	if (!req.params.lpa19CD) {
		throw ApiError.badRequest('No lpa19CD provided');
	}

	const lpa19CD = req.params.lpa19CD;

	try {
		const result = await service.get(null, null, lpa19CD);
		res.status(200).send(result);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err, lpa19CD }, 'error getting LPA by lpa19CD');
		throw ApiError.withMessage(500, 'unexpected error');
	}
};

/**
 * @type {import('express').RequestHandler}
 */
exports.post = async (req, res) => {
	const doc = await service.createLpaList(req.body);
	res.send(doc);
};
