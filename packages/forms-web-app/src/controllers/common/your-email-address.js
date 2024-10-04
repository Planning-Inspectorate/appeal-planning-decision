const { logoutUser } = require('../../services/user.service');

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
		const { errors = {}, errorSummary = [], 'email-address': email } = body;
		const emailErrorSummary = [
			{
				text: 'Enter an email address in the correct format, like name@example.com',
				href: '#your-email-address'
			}
		];
		if (!email) {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				errors,
				errorSummary: emailErrorSummary
			});
			return;
		}

		if (Object.keys(errors).length > 0) {
			console.log('errors', errors);
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		logoutUser(req);

		try {
			const user = await req.appealsApiClient.getUserByEmailV2(email);
			if (!user) {
				throw new Error('user not found');
			}
			const id = user.id;

			res.redirect(`/${views.ENTER_CODE}/${id}`);
		} catch (e) {
			res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors: {
					'email-address': {
						// TODO concoct an error message that communicates that the
						// email provided doesn't belong to an admin
						msg: 'Enter an email address in the correct format, like name@example.com'
					}
				},
				errorSummary: emailErrorSummary
			});
		}
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
