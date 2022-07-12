const { isEmailLinkExpired } = require('../../../lib/appeals-api-wrapper');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');
const {
	VIEW: {
		SUBMIT_APPEAL: { LINK_EXPIRED }
	}
} = require('../../../lib/submit-appeal/views');

const getEmailConfirmed = async (req, res) => {
	let emailLinkExpired = await isEmailLinkExpired(req.params.token);
	if (emailLinkExpired) {
		return res.redirect(`/${LINK_EXPIRED}`);
	}
	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl: `/${LIST_OF_DOCUMENTS}`
	});
};

module.exports = {
	getEmailConfirmed
};
