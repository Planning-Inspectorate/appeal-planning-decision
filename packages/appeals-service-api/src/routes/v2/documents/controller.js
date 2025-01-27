const ApiError = require('#errors/apiError');
const service = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const doc = await service.put(req.body);
	res.json(doc);
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
