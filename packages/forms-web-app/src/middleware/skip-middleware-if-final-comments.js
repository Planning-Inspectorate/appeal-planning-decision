exports.skipMiddlewareIfFinalComments = (fn) => {
	return (req, res, next) => {
		if (req.path.includes('submit-final-comment')) {
			next();
		} else {
			fn(req, res, next);
		}
	};
};
