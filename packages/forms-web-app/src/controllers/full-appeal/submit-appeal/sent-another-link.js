const { createConfirmEmail, getExistingAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { SENT_ANOTHER_LINK: currentPage }
	}
} = require('../../../lib/full-appeal/views');

const getSentAnotherLink = async (req, res) => {
	const appealId = req.session.confirmEmailId;
	req.session.confirmEmailId = null;
	const appeal = await getExistingAppeal(appealId);
	createConfirmEmail(appeal);
	res.render(currentPage, {
		appeal: appeal
	});
};

module.exports = {
	getSentAnotherLink
};
