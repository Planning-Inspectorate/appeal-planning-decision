const getRequestNewCode = (views) => {
	return async (_, res) => {
		res.render(views.REQUEST_NEW_CODE);
	};
};
const postRequestNewCode = (views) => {
	return async (req, res) => {
		const id = req.session.userTokenId;
		delete req.session.userTokenId;
		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;
		res.redirect(`/${views.ENTER_CODE}/${id}`);
	};
};

module.exports = {
	getRequestNewCode,
	postRequestNewCode
};
