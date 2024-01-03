const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { apiClient } = require('#lib/appeals-api-client');
const AppealsApiError = require('@pins/common/src/client/appeals-api-error');
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
				setSession();
				res.redirect(`/${views.ENTER_CODE}/${getSessionAppealId(req.session)}`);
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

		let user;

		try {
			user = await apiClient.getUserByEmailV2(email);
		} catch (err) {
			if (!(err instanceof AppealsApiError) || !err.errors?.includes('The user was not found')) {
				throw err;
			}
		}

		if (!user) {
			user = await apiClient.createUser(email);
		}

		setSession();
		res.redirect(`/${views.ENTER_CODE}`);

		function setSession() {
			setSessionEnterCode(req.session, {}, true);
			setSessionEnterCodeAction(req.session, enterCodeConfig.actions.confirmEmail);
		}
	};
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
