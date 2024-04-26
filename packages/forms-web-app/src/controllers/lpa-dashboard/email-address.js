const { getUserFromSession } = require('../../services/user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { EMAIL_ADDRESS, CONFIRM_ADD_USER }
	}
} = require('../../lib/views');

const getEmailAddress = async (req, res) => {
	const user = getUserFromSession(req);

	return res.render(EMAIL_ADDRESS, {
		lpaDomain: `@${user.lpaDomain}`
	});
};

const postEmailAddress = async (req, res) => {
	const { errors = {}, errorSummary = [] } = req.body;

	const user = getUserFromSession(req);

	if (Object.keys(errors).length > 0) {
		return res.render(EMAIL_ADDRESS, {
			lpaDomain: `@${user.lpaDomain}`,
			errors,
			errorSummary
		});
	}

	const addUserPrefix = req.body['add-user'];

	req.session.addUserEmailAddress = `${addUserPrefix}@${user.lpaDomain}`;

	return res.redirect(`/${CONFIRM_ADD_USER}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
