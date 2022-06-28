module.exports = (req, res, next) => {
	const { type } = req.query;

	if (type) {
		req.body.type = type;
	}

	next();
};
