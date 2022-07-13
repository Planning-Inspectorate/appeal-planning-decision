const { saveAppeal, sendToken } = require('../lib/appeals-api-wrapper');
const { VIEW } = require('../lib/submit-appeal/views');

const postSaveAndReturn = async (req, res) => {
	req.session.navigationHistory.shift();
	await saveAppeal(req.session.appeal);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
};

const continueAppeal = async (req, res) => {
	const { appeal } = req.session;
	await sendToken(appeal);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.ENTER_CODE}`);
};

module.exports = {
	postSaveAndReturn,
	continueAppeal
};
