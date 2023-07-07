const { enterCodeConfig } = require('@pins/common');

const getYourEmailAddress = (views) => {
	return (req, res) => {
		const { email } = req.session.email;
		res.render(views.EMAIL_ADDRESS, {
			email
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

		req.session.email = body['email-address'];
		const { email } = req.session.email;

		if (Object.keys(errors).length > 0) {
			res.render(views.EMAIL_ADDRESS, {
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
