const { VIEW } = require('../../lib/views');

const getNeedNewCode = async (req, res) => {
	const {
		session: { getNewCodeHref }
	} = req;
	res.render(VIEW.FINAL_COMMENT.NEED_NEW_CODE, {
		getNewCodeHref
	});
};

module.exports = {
	getNeedNewCode
};
