const { createConfirmEmail } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { CONFIRM_EMAIL_ADDRESS, EMAIL_ADDRESS }
	}
} = require('../../../lib/full-appeal/views');

const getConfirmEmailAddress = async (req, res) => {
	await createConfirmEmail(req.session.appeal);
	res.render(CONFIRM_EMAIL_ADDRESS, {
		emailAddress: req.session.appeal.email,
		backLink: `/${EMAIL_ADDRESS}`
	});
};

module.exports = { getConfirmEmailAddress };
