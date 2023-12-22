const getNeedNewCode = (views) => {
	return async (_, res) => {
		res.render(views.NEED_NEW_CODE);
	};
};

const postNeedNewCode = (views) => {
	return async (req, res) => {
		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;

		const params = req.params.id ? `/${req.params.id}` : '';
		const url = `/${views.ENTER_CODE}${params}`;
		res.redirect(url);
	};
};

module.exports = {
	getNeedNewCode,
	postNeedNewCode
};
