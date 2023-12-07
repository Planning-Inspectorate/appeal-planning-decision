const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');
const {
	setSessionAppeal,
	getSessionAppeal,
	setSessionEmail,
	setSessionEnterCode,
	setSessionEnterCodeAction,
	getSessionAppealId
} = require('../../lib/session-helper');

const getEmailAddress = (views, appealInSession) => {
	return (req, res) => {
		const { email } = appealInSession ? req.session.appeal : req.session;
		res.render(views.EMAIL_ADDRESS, {
			email
		});
	};
};

const postEmailAddress = (views, appealInSession) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;

		const email = body['email-address'];
		setSessionEmail(req.session, email, appealInSession);
		let appeal;
		if (appealInSession) {
			appeal = getSessionAppeal(req.session);
		}

		if (Object.keys(errors).length > 0) {
			res.render(views.EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		if (appealInSession) {
			try {
				setSessionAppeal(req.session, await createOrUpdateAppeal(appeal));
			} catch (e) {
				logger.error(e);
				res.render(views.EMAIL_ADDRESS, {
					email,
					errors,
					errorSummary: [{ text: e.toString(), href: '#' }]
				});
				return;
			}
		}

		setSessionEnterCode(req.session, {}, true);
		setSessionEnterCodeAction(req.session, enterCodeConfig.actions.confirmEmail);

		if (appealInSession) {
			res.redirect(`/${views.ENTER_CODE}/${getSessionAppealId(req.session)}`);
		} else {
			res.redirect(`/${views.ENTER_CODE}`);
		}
	};
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
