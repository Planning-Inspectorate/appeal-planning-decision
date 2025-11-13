const ApiError = require('#errors/apiError');
const { put, delete: del } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const data = await put(req.body);
	res.send(data);
};

/**
 * @type {import('express').RequestHandler}
 */
exports.delete = async (req, res) => {
	if (!req.params.id) {
		throw ApiError.badRequest('No event id provided');
	}
	await del(req.params.id);
	res.sendStatus(200);
};
