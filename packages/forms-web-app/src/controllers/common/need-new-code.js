const getNeedNewCode = (views) => {
	return async (req, res) => {
		res.render(views.NEED_NEW_CODE);
	};
};

const postNeedNewCode = (views) => {
	return async (req, res) => {
		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;

		const url = `/${views.ENTER_CODE}/${req.params.id}`;
		res.redirect(url);
	};
};

module.exports = {
	getNeedNewCode,
	postNeedNewCode
};
