const { getConfirmEmail } = require('../../../lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../lib/is-token-expired');

const {
	VIEW: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS, LINK_EXPIRED }
} = require('../../../lib/views');

const getEmailConfirmed = async (req, res) => {
	const retrievedEmailConfirmation = await getConfirmEmail(req.session.appeal.id);
	const emailConfirmationCreated = new Date(retrievedEmailConfirmation.createdAt);

	if (isTokenExpired(30, emailConfirmationCreated)) {
		return res.redirect(`/${LINK_EXPIRED}`);
	}

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl: `/${LIST_OF_DOCUMENTS}`
	});
};

module.exports = {
	getEmailConfirmed
};
