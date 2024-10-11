// const { logoutUser } = require('../../services/user.service');

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
		const { errors = {}, errorSummary = [], 'email-address': email } = body;
		const emailErrorSummary = [
			{
				text: 'Enter an email address in the correct format, like name@example.com',
				href: '#email-address'
			}
		];
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

		// logoutUser(req);

		try {
			const user = await req.appealsApiClient.getUserByEmailV2(email);
			if (!user) {
				throw new Error('user not found');
			}
			const id = user.id;

			res.redirect(`/${views.ENTER_CODE}/${id}`);
		} catch (e) {
			res.render(views.EMAIL_ADDRESS, {
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
	getR6EmailAddress,
	postR6EmailAddress
};
