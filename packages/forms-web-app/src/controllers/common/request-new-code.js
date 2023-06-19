const getRequestNewCode = (requestNewCodeView) => {
	return async (_, res) => {
		res.render(requestNewCodeView);
	};
};
const postRequestNewCode = (enterCodeView) => {
	return async (req, res) => {
		const id = req.session.userTokenId;
		delete req.session.userTokenId;

		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;

		res.redirect(`/${enterCodeView}/${id}`);
	};
};

module.exports = {
	getRequestNewCode,
	postRequestNewCode
};
