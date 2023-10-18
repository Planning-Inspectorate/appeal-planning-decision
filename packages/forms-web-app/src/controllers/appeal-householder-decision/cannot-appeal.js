const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../lib/views');
const { businessRulesDeadline, getDeadlinePeriod } = require('../../lib/calculate-deadline');

const getCannotAppeal = (req, res) => {
	const { appeal } = req.session;
	const beforeYouStartFirstPage = '/before-you-start';
	const deadlineDate = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	const deadlinePeriod = getDeadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	res.render(CANNOT_APPEAL, {
		beforeYouStartFirstPage,
		deadlineDate,
		deadlinePeriod: deadlinePeriod.description
	});
};

module.exports = {
	getCannotAppeal
};
