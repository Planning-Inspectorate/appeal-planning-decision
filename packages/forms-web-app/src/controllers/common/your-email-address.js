const { enterCodeConfig } = require('@pins/common');

const getYourEmailAddress = (views) => {
	return (req, res) => {
		const { email } = req.session;
		res.render(views.YOUR_EMAIL_ADDRESS, {
			email: email
		});
	};
};

const postYourEmailAddress = (views) => {
	return async (req, res) => {
		const {
			body,
			params: { id }
		} = req;

		const { errors = {}, errorSummary = [] } = body;
		if (!body['email-address'] || body['email-address'] === '') {
			const customErrorSummary = [
				{
					text: 'Enter an email address in the correct format, like name@example.com',
					href: '#your-email-address'
				}
			];
			res.render(`/${views.YOUR_EMAIL_ADDRESS}`, {
				errors,
				errorSummary: customErrorSummary
			});
			return;
		}

		const { email } = body['email-address'];
		req.session.email = email;

		if (Object.keys(errors).length > 0) {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.action = enterCodeConfig.actions.confirmEmail;

		res.redirect(`/${views.ENTER_CODE}/${id}`);
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
