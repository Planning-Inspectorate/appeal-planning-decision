const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');

const getConfirmEmailAddress = async (req, res) => {
	await createConfirmEmail(req.session.appeal);
	res.render('appeal-householder-decision/confirm-email-address', {
		emailAddress: req.session.appeal.email
	});
};

module.exports = { getConfirmEmailAddress };
