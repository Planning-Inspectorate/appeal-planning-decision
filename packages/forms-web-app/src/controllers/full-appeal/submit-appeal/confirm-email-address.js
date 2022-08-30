const { createConfirmEmail } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: { CONFIRM_EMAIL_ADDRESS }
} = require('../../../lib/views');

const getConfirmEmailAddress = async (req, res) => {
	await createConfirmEmail(req.session.appeal);
	const { typeOfPlanningApplication } = req.session.appeal;

	res.render(`/${CONFIRM_EMAIL_ADDRESS}`, {
		typeOfPlanningApplication,
		emailAddress: req.session.appeal.email
	});
};

module.exports = { getConfirmEmailAddress };
