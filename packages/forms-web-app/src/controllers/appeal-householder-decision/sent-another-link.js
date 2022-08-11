const { createConfirmEmail } = require('../../lib/appeals-api-wrapper');

const {
	VIEW: { SENT_ANOTHER_LINK }
} = require('../../lib/views');

const getSentAnotherLink = async (req, res) => {
	const { appeal, typeOfApplication } = req.session.appeal;
	createConfirmEmail(appeal);
	res.render(SENT_ANOTHER_LINK, {
		appeal: appeal,
		typeOfApplication
	});
};

module.exports = {
	getSentAnotherLink
};
