const {
	broadMiddlewareA,
	broadMiddlewareB,
	specificMiddlewareA,
	specificMiddlewareB
} = require('../../middleware');
const { drinks } = require('../constants');

/**
 * @typedef {import('express').Handler} Handler
 * @typedef {import('../../../types').Middleware} Middleware
 */

/** @type Handler */
exports.get = (req, res) => {
	const drink = drinks[Number(req.params.id)];
	if (!drink) res.sendStatus(404);
	res.send(drink);
};

/** @type Handler */
exports.delete = (req, res) => {
	res.send(`Deleted ${req.body}`);
};

exports.rogueFunction = () => {};

/** @type Handler */
exports.head = (req, res) => {
	res.send(`head at /drinks/${req.params.id}`);
};
/** @type Handler */
exports.options = (req, res) => {
	res.send(`options at /drinks/${req.params.id}`);
};
/** @type Handler */
exports.patch = (req, res) => {
	res.send(`patch at /drinks/${req.params.id}`);
};
/** @type Handler */
exports.post = (req, res) => {
	res.send(`post at /drinks/${req.params.id}`);
};
/** @type Handler */
exports.put = (req, res) => {
	res.send(`put at /drinks/${req.params.id}`);
};
/** @type Handler */
exports.trace = (req, res) => {
	res.send(`trace at /drinks/${req.params.id}`);
};

/** @type Middleware */
exports.middleware = [
	[broadMiddlewareA, broadMiddlewareB],
	{ put: [specificMiddlewareA], patch: [specificMiddlewareA], get: [specificMiddlewareB] }
];
