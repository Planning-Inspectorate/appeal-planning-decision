const { ingredients } = require('../constants');

/**
 * @typedef {import('express').Handler} Handler
 */

/** @type Handler */
exports.get = (req, res) => {
	const sandwich = ingredients[Number(req.params.ingredientId)];
	if (!sandwich) res.sendStatus(404);
	res.send(sandwich);
};
