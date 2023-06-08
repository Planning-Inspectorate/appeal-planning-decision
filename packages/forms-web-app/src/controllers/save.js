const { saveAppeal, sendToken } = require('../lib/appeals-api-wrapper');
const { VIEW } = require('../lib/submit-appeal/views');
const { enterCodeConfig } = require('@pins/common');

const postSaveAndReturn = async (req, res) => {
	await saveAppeal(req.session.appeal);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
};

const continueAppeal = async (req, res) => {
	const { appeal } = req.session;
	await sendToken(appeal, enterCodeConfig.actions.saveAndReturn);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.ENTER_CODE}`);
};

module.exports = {
	postSaveAndReturn,
	continueAppeal
};
