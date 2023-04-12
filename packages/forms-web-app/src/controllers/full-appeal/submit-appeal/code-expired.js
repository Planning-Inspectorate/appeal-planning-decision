const {
	VIEW: {
		FULL_APPEAL: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');

const getCodeExpired = (req, res) => {
	const url = `/${ENTER_CODE}/${req.session.userTokenId}`;
	delete req.session.userTokenId;
	res.render(CODE_EXPIRED, { url });
};

module.exports = {
	getCodeExpired
};
