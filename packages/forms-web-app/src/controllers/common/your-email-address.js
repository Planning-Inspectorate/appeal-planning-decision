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
		const emailErrorSummary = [
			{
				text: 'Enter an email address in the correct format, like name@example.com',
				href: '#your-email-address'
			}
		];
		if (!body['email-address'] || body['email-address'] === '') {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				errors,
				errorSummary: emailErrorSummary
			});
			return;
		}

		const email = body['email-address'];

		if (Object.keys(errors).length > 0) {
			console.log('errors', errors);
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		try {
			const user = await getUserByEmail(email);
			if (!user) {
				throw new Error('user not found');
			}
			const id = user._id;

			res.redirect(`/${views.ENTER_CODE}/${id}`);
		} catch (e) {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors: {
					'email-address': {
						msg: 'Enter an email address in the correct format, like name@example.com'
					}
				},
				errorSummary: emailErrorSummary
			});
			return;
		}
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
