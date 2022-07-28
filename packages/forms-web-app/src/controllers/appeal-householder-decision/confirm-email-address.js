const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');

const getConfirmEmailAddress = async (req, res) => {
	await createConfirmEmail(req.session.appeal);
	res.render('appeal-householder-decision/confirm-email-address', {
		emailAddress: req.session.appeal.email,
		resendLink: '/appeal-householder-decision/sent-another-link'
	});
};

module.exports = { getConfirmEmailAddress };
