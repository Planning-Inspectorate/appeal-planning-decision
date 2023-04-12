const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const getRequestNewCode = async (_, res) => {
	res.render(REQUEST_NEW_CODE);
};

const postRequestNewCode = async (req, res) => {
	const id = req.session.userTokenId;
	delete req.session.userTokenId;
	res.redirect(`/${ENTER_CODE}/${id}`);
};

module.exports = {
	getRequestNewCode,
	postRequestNewCode
};
