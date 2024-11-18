const { isProduction } = require('../config');
const version = require('../../package.json').version;

const cachBusting = (req, res, next) => {
	res.locals.cacheBustVersion = `${version}${isProduction ? '' : '.' + Date.now()}`;
	return next();
};

module.exports = cachBusting;
