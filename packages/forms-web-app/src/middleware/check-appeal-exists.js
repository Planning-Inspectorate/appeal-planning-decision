const checkAppealExists = (req, res, next) => {
	const { session: { appeal } = {} } = req;

	if (appeal && appeal.appealType) {
		return next();
	}

	return res.redirect('/');
};

module.exports = checkAppealExists;
