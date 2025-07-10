const { logoutUser } = require('../../services/user.service');
const crypto = require('node:crypto');

const getYourEmailAddress = (views) => {
	return (req, res) => {
		const { email } = req.session;
		res.render(views.YOUR_EMAIL_ADDRESS, {
			email: email
		});
	};
};

const postYourEmailAddress = (views, emailUUIDcache) => {
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
				throw new Error('User does not exist');
			}
			res.redirect(`/${views.ENTER_CODE}/${user.id}`);
		} catch (error) {
			let id = emailUUIDcache.get(email);
			if (!id) {
				id = crypto.randomUUID();
				emailUUIDcache.set(email, id);
			}
			res.redirect(`/${views.ENTER_CODE}/${id}`);
		}
	};
};

module.exports = {
	getYourEmailAddress,
	postYourEmailAddress
};
