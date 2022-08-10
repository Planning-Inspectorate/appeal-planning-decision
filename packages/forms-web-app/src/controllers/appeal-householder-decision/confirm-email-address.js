const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: { CONFIRM_EMAIL_ADDRESS }
} = require('../../lib/views');

const getConfirmEmailAddress = async (req, res) => {
	await createConfirmEmail(req.session.appeal);
	res.render(CONFIRM_EMAIL_ADDRESS, {
		emailAddress: req.session.appeal.email,
		resendLink: '/appeal-householder-decision/sent-another-link'
	});
};

module.exports = { getConfirmEmailAddress };
