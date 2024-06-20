const { put } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	await put(req.body);
	res.sendStatus(200);
};
