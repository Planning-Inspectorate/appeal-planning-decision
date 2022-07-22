const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const getRequestNewCode = async (_, res) => {
	res.render(REQUEST_NEW_CODE);
};

const postRequestNewCode = async (_, res) => {
	res.redirect(`/${ENTER_CODE}`);
};

module.exports = {
	getRequestNewCode,
	postRequestNewCode
};
