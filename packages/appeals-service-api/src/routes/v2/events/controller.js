const { put } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const data = await put(req.body);
	res.send(data);
};
