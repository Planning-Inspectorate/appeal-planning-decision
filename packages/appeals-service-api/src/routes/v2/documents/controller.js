const { put } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const doc = await put(req.body);
	res.send(doc);
};
