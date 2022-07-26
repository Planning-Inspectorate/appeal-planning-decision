const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');

const getSentAnotherLink = async (req, res) => {
	const appeal = req.session.appeal;
	createConfirmEmail(appeal);
	res.render('appeal-householder-decision/sent-another-link', {
		appeal: appeal
	});
};

module.exports = {
	getSentAnotherLink
};
