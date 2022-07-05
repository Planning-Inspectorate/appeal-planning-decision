const { saveAppeal, sendToken } = require('../lib/appeals-api-wrapper');
const { VIEW } = require('../lib/submit-appeal/views');
const { calculateDeadline } = require('../lib/calculate-deadline');
const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL }
	}
} = require('../lib/full-appeal/views');

const postSaveAndReturn = async (req, res) => {
	req.session.navigationHistory.shift();
	await saveAppeal(req.session.appeal);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
};

const continueAppeal = async (req, res) => {
	const { appeal } = req.session;
	const deadlineHasPassed = calculateDeadline.hasDeadlineDatePassed(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	if (deadlineHasPassed) {
		res.redirect(`/${CANNOT_APPEAL}`);
	}
	await sendToken(appeal);
	res.redirect(`/${VIEW.SUBMIT_APPEAL.ENTER_CODE}`);
};

module.exports = {
	postSaveAndReturn,
	continueAppeal
};
