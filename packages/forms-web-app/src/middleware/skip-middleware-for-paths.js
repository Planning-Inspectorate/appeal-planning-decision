function pathIncludesAnyString(path, strings) {
	for (const string of strings) {
		if (path.includes(string)) {
			return true;
		}
	}

	return false;
}

exports.skipMiddlewareForPaths = (middleware, paths = []) => {
	return (req, res, next) => {
		if (paths.length === 0 || !pathIncludesAnyString(req.path, paths)) {
			middleware(req, res, next);
		} else {
			next();
		}
	};
};
