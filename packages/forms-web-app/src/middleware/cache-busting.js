const { isProduction } = require('../config');
const version = require('../../package.json').version;

const cacheBusting = (req, res, next) => {
	res.locals.cacheBustVersion = `${version}${isProduction ? '' : '.' + Date.now()}`;
	return next();
};

module.exports = cacheBusting;
