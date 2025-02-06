const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const service = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.get = async (req, res) => {
	if (!req.params.id) {
		throw ApiError.badRequest('No document id provided');
	}

	const documentId = req.params.id;

	try {
		const document = await service.get(documentId);
		res.status(200).send(document);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err, documentId }, 'error getting document');
		throw ApiError.withMessage(500, 'unexpected error');
	}
};

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const doc = await service.put(req.body);
	res.send(doc);
};

/**
 * @type {import('express').RequestHandler}
 */
exports.delete = async (req, res) => {
	if (!req.params.id) {
		throw ApiError.badRequest('No document id provided');
	}
	await service.delete(req.params.id);
	res.sendStatus(200);
};
