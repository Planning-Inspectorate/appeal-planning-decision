const { getConfirmEmail } = require('../../../lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../lib/is-token-expired');

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

const getEmailConfirmedNoToken = (_, res) => {
	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl: `/${LIST_OF_DOCUMENTS}`
	});
};

const getEmailConfirmed = async (req, res) => {
	const retrievedToken = await getConfirmEmail(req.params.token);
	const tokenCreated = new Date(retrievedToken.createdAt);

	if (isTokenExpired(30, tokenCreated)) {
		return res.redirect(`/${LINK_EXPIRED}`);
	}

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl: `/${LIST_OF_DOCUMENTS}`
	});
};

module.exports = {
	getEmailConfirmed,
	getEmailConfirmedNoToken
};
