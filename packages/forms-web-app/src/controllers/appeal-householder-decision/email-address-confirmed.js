const { getConfirmEmail } = require('../../lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../lib/is-token-expired');

const getEmailConfirmed = async (req, res) => {
	const retrievedEmailConfirmation = await getConfirmEmail(req.session.appeal.id);
	const emailConfirmationCreated = new Date(retrievedEmailConfirmation.createdAt);

	if (isTokenExpired(30, emailConfirmationCreated)) {
		return res.redirect('/appeal-householder-decision/link-expired');
	}
	const listOfDocumentsUrl = 'list-of-documents';
	res.render('appeal-householder-decision/email-address-confirmed', {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
