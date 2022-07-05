const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL }
	}
} = require('../../../lib/full-appeal/views');
const { calculateDeadline } = require('../../../lib/calculate-deadline');

const getCannotAppeal = (req, res) => {
	const { appeal } = req.session;
	const beforeYouStartFirstPage = '/before-you-start';
	const deadlineDate = calculateDeadline.businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	const deadlinePeriod = calculateDeadline.getDeadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	if (deadlinePeriod.time === 181 && deadlinePeriod.duration === 'days') {
		deadlinePeriod.time = 6;
		deadlinePeriod.duration = 'months';
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
