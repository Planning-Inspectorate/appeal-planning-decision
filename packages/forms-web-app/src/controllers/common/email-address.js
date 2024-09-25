const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { ApiClientError } = require('@pins/common/src/client/api-client-error');
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
const { logoutUser } = require('../../services/user.service');

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

		const email = body['email-address']?.trim();
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
				return;
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
			user = await req.appealsApiClient.getUserByEmailV2(email);
		} catch (err) {
			if (!(err instanceof ApiClientError) || err.code != 404) {
				throw err;
			}
		}

		if (!user) {
			user = await req.appealsApiClient.createUser({
				email: email
			});
		}

		setSession();
		res.redirect(`/${views.ENTER_CODE}`);

		function setSession() {
			logoutUser(req);
			setSessionEnterCode(req.session, {}, true);
			setSessionEnterCodeAction(req.session, enterCodeConfig.actions.confirmEmail);
		}
	};
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
