const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL }
	}
} = require('../../../lib/full-appeal/views');
const { businessRulesDeadline, getDeadlinePeriod } = require('../../../lib/calculate-deadline');
const { arraysEqual } = require('../../../lib/arrays-equal');

const getCannotAppeal = (req, res) => {
	const { appeal } = req.session;
	const beforeYouStartFirstPage = '/before-you-start';
	const deadlineDate = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	let deadlinePeriod = getDeadlinePeriod(appeal.appealType, appeal.eligibility.applicationDecision);

	if (arraysEqual(Object.values(deadlinePeriod), ['days', 84])) {
		deadlinePeriod = {
			time: 12,
			duration: 'weeks'
		};
	}

	res.render(CANNOT_APPEAL, {
		beforeYouStartFirstPage,
		deadlineDate,
		deadlinePeriod
	});
};

module.exports = {
	getCannotAppeal
};
