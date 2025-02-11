const { put } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const serviceUser = await put(req.body);
	res.json(serviceUser);
};
