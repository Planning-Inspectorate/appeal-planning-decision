const {
	VIEW: { EMAIL_ADDRESS, CONFIRM_EMAIL_ADDRESS }
} = require('../../../lib/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');

const getEmailAddress = (req, res) => {
	const { email, typeOfPlanningApplication } = req.session.appeal;
	res.render(EMAIL_ADDRESS, {
		typeOfPlanningApplication,
		email
	});
};

const postEmailAddress = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const {
		appeal,
		appeal: { email }
	} = req.session;

	appeal.email = body['email-address'];

	if (Object.keys(errors).length > 0) {
		res.render(EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		res.render(EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(`${CONFIRM_EMAIL_ADDRESS}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
