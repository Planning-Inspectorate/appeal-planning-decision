const {
	VIEW: { EMAIL_ADDRESS_CONFIRMED, LINK_EXPIRED }
} = require('../../lib/views');
const { getConfirmEmail } = require('../../lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../lib/is-token-expired');

const getEmailConfirmed = async (req, res) => {
	const retrievedEmailConfirmation = await getConfirmEmail(req.session.appeal.id);
	const emailConfirmationCreated = new Date(retrievedEmailConfirmation.createdAt);

	if (isTokenExpired(30, emailConfirmationCreated)) {
		return res.redirect(`${LINK_EXPIRED}`);
	}
	const listOfDocumentsUrl = 'list-of-documents';
	res.render(EMAIL_ADDRESS_CONFIRMED, {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
