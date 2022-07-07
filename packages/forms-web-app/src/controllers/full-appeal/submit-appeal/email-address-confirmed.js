const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../lib/full-appeal/views');

const getEmailConfirmed = (req, res) => {
	const listOfDocumentsUrl = '/full-appeal/submit-appeal/list-of-documents';
	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
