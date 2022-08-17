const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');

const {
	VIEW: { SENT_ANOTHER_LINK }
} = require('../../../src/lib/views');

const getSentAnotherLink = async (req, res) => {
	const { appeal, typeOfPlanningApplication } = req.session.appeal;
	createConfirmEmail(appeal);
	res.render(SENT_ANOTHER_LINK, {
		appeal: appeal,
		typeOfPlanningApplication
	});
};

module.exports = {
	getSentAnotherLink
};
