const {
	setSessionEmail,
	setSessionEnterCode,
	setSessionEnterCodeAction
} = require('../../lib/session-helper');
const { enterCodeConfig } = require('@pins/common');
const { logoutUser } = require('../../services/user.service');

const getR6EmailAddress = (views) => {
	return (req, res) => {
		const { email } = req.session;
		res.render(views.EMAIL_ADDRESS, {
			email: email
		});
	};
};

const postR6EmailAddress = (views) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;
		const emailErrorSummary = [
			{
				text: 'Enter your email address',
				href: '#email-address'
			}
		];

		const email = body['email-address']?.trim();
		setSessionEmail(req.session, email, false);

		if (!email) {
			res.render(views.EMAIL_ADDRESS, {
				errors,
				errorSummary: emailErrorSummary
			});
			return;
		}

		if (Object.keys(errors).length > 0) {
			console.log('errors', errors);
			res.render(views.EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		try {
			const user = await req.appealsApiClient.getUserByEmailV2(email);
			if (!user) {
				throw new Error('user not found');
			}
			const id = user.id;
			setSession();
			res.redirect(`/${views.ENTER_CODE}/${id}`);
		} catch (e) {
			res.render(views.EMAIL_ADDRESS, {
				email,
				errors: {
					'email-address': {
						msg: 'Enter your email address'
					}
				},
				errorSummary: emailErrorSummary
			});
			return;
		}

		function setSession() {
			logoutUser(req);
			setSessionEnterCode(req.session, {}, true);
			setSessionEnterCodeAction(req.session, enterCodeConfig.actions.confirmEmail);
		}
	};
};

module.exports = {
	getR6EmailAddress,
	postR6EmailAddress
};
