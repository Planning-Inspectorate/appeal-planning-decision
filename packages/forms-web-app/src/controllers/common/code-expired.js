const getCodeExpired = (views) => {
	return async (req, res) => {
		const url = `/${views.ENTER_CODE}/${req.session.userTokenId}`;
		delete req.session.userTokenId;
		res.render(views.CODE_EXPIRED, { url });
	};
};

module.exports = {
	getCodeExpired
};
