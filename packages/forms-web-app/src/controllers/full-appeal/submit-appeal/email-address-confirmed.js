const logger = require('../../../lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');

const getEmailConfirmed = (req, res) => {
	res.render(EMAIL_CONFIRMED, {});
};

const postEmailConfirmed = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;

	try {
		return res.redirect(`/${LIST_OF_DOCUMENTS}`);
	} catch (e) {
		logger.error(e);
		return res.render(EMAIL_CONFIRMED, {
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getEmailConfirmed,
	postEmailConfirmed
};
