const { getUserByEmail } = require('../../lib/appeals-api-wrapper');

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
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;
		if (!body['email-address'] || body['email-address'] === '') {
			const customErrorSummary = [
				{
					text: 'Enter an email address in the correct format, like name@example.com',
					href: '#your-email-address'
				}
			];
			res.render(views.YOUR_EMAIL_ADDRESS, {
				errors,
				errorSummary: customErrorSummary
			});
			return;
		}

		const { email } = body['email-address'];
		const user = await getUserByEmail(email);
		const id = user._id;

		req.session.email = email;

		if (Object.keys(errors).length > 0) {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		res.redirect(`/${views.ENTER_CODE}/${id}`);
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
