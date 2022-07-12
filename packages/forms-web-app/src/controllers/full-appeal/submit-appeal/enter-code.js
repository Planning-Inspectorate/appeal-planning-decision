const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, REQUEST_NEW_CODE }
	}
} = require('../../../lib/full-appeal/views');

const { calculateDeadline } = require('../lib/calculate-deadline');
const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL }
	}
} = require('../lib/full-appeal/views');

const getEnterCode = async (req, res) => {
	const {
		session: { appeal }
	} = req;
	const deadlineHasPassed = calculateDeadline.hasDeadlineDatePassed(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	if (deadlineHasPassed) {
		res.redirect(`/${CANNOT_APPEAL}`);
	}
	const url = `/${REQUEST_NEW_CODE}`;
	await sendToken(appeal);
	res.render(ENTER_CODE, {
		requestNewCodeLink: url
	});
};

const postEnterCode = async (req, res) => {
	const token = req.body['email-code'];

	const saved = await getSavedAppeal(token);
	req.session.appeal = await getExistingAppeal(saved.appealId);
	res.redirect(`/${TASK_LIST}`);
};

module.exports = {
	getEnterCode,
	postEnterCode
};
