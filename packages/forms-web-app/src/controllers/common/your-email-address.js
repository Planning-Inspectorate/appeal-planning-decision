const { getUserByEmail } = require('../../lib/appeals-api-wrapper');
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

		const email = body['email-address'];

		await getUserByEmail(email);
		req.session.email = email;
		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.action = enterCodeConfig.actions.confirmEmail;
		res.redirect(`/${views.ENTER_CODE}/${id}`);
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
