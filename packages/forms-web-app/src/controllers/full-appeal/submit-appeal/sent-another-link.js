const { createConfirmEmail } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { SENT_ANOTHER_LINK: currentPage }
	}
} = require('../../../lib/full-appeal/views');

const getSentAnotherLink = async (req, res) => {
	const appeal = req.session.appeal;
	createConfirmEmail(appeal);
	res.render(currentPage, {
		appeal: appeal
	});
};

module.exports = {
	getSentAnotherLink
};
