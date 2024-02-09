const { sandwiches } = require('../constants');

/**
 * @typedef {import('express').Handler} Handler
 */

/** @type Handler */
exports.get = (req, res) => {
	const sandwich = sandwiches[Number(req.params.id)];
	if (!sandwich) res.sendStatus(404);
	res.send(sandwich);
};
