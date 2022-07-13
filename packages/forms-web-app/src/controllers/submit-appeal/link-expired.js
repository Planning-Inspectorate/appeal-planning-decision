const {
	VIEW: {
		SUBMIT_APPEAL: { LINK_EXPIRED }
	}
} = require('../../lib/submit-appeal/views');

const getLinkExpired = (_, res) => {
	const newLinkUrl = '/full-appeal/submit-appeal/sent-another-link';
	res.render(LINK_EXPIRED, { sendNewLinkUrl: newLinkUrl });
};

module.exports = { getLinkExpired };
