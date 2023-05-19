const {
	VIEW: {
		FULL_APPEAL: { EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../../lib/logger');

const getEmailAddress = (req, res) => {
	const { email } = req.session.appeal;
	res.render(EMAIL_ADDRESS, {
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

	req.session.enterCode = req.session.enterCode || {};
	req.session.enterCode.action = enterCodeConfig.actions.confirmEmail;

	res.redirect(`/${ENTER_CODE}/${req.session.appeal.id}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
