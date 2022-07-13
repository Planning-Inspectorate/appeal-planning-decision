const {
	VIEW: {
		SUBMIT_APPEAL: { LINK_EXPIRED }
	}
} = require('../../lib/submit-appeal/views');

const getLinkExpired = (req, res) => {
	const newLinkUrl = '/full-appeal/submit-appeal/sent-another-link';
	const appealType = req.session.appeal.appealType;
	res.render(LINK_EXPIRED, { sendNewLinkUrl: newLinkUrl, appealType: appealType });
};

module.exports = { getLinkExpired };
