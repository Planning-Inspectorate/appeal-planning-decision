const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../lib/views');
const { calculateDeadline } = require('../../lib/calculate-deadline');
const { arraysEqual } = require('../../lib/arrays-equal');

const getCannotAppeal = (req, res) => {
	const { appeal } = req.session;
	const beforeYouStartFirstPage = '/before-you-start';
	const deadlineDate = calculateDeadline.businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	let deadlinePeriod = calculateDeadline.getDeadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	if (arraysEqual(Object.values(deadlinePeriod), ['days', 181])) {
		deadlinePeriod = {
			time: 6,
			duration: 'months'
		};
	} else if (arraysEqual(Object.values(deadlinePeriod), ['days', 83])) {
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
