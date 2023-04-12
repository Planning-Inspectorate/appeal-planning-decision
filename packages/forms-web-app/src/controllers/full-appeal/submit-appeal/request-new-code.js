const {
	VIEW: {
		FULL_APPEAL: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');

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
