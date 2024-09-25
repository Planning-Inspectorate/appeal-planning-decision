const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { enterCodeConfig } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { logoutUser } = require('../../services/user.service');

const getEmailAddress = (req, res) => {
	const { email } = req.session.appeal;
	return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
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

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary
		});
	}

	try {
		appeal.email = body['email-address'];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}

	logoutUser(req);
	req.session.enterCode = req.session.enterCode || {};
	req.session.enterCode.action = enterCodeConfig.actions.confirmEmail;

	res.redirect(`/appeal-householder-decision/enter-code/${req.session.appeal.id}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
