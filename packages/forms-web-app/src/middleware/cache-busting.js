// The version is based on the timestamp of when the application starts for now
const version = Date.now();

const cacheBusting = (req, res, next) => {
	res.locals.cacheBustVersion = version;
	return next();
};

module.exports = cacheBusting;
