const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');

const getEmailConfirmed = async (req, res) => {
	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl: `/${LIST_OF_DOCUMENTS}`
	});
};

module.exports = {
	getEmailConfirmed
};
