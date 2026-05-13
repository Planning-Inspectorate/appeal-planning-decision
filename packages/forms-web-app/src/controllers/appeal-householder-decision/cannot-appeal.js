const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../lib/views');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');
const { rules } = require('@pins/business-rules/');

const getCannotAppeal = (req, res) => {
	const { appeal } = req.session;
	const beforeYouStartFirstPage = '/before-you-start';
	const deadlineDate = calculateDeadlineFromBeforeYouStart({ appeal });
	const deadlinePeriod = rules.appeal.deadlinePeriod(
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
