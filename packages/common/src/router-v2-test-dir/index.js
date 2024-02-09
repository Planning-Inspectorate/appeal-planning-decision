/**
 * @typedef {import('express').Handler} Handler
 */

/** @type Handler */
exports.get = (_req, res) => {
	res.send('Homepage');
};

/** @type Handler */
exports.post = (req, res) => {
	res.send(`Received ${req.body} in post to home`);
};
