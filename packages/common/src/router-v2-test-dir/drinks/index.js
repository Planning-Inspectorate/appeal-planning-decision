const { drinks } = require('./constants');

/**
 * @typedef {import('express').Handler} Handler
 */

/** @type Handler */
exports.get = (_req, res) => {
	res.send(drinks);
};
