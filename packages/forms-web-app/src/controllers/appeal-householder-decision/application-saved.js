const {
	VIEW: { APPLICATION_SAVED }
} = require('../../lib/views');

const { calculateDeadline } = require('../../lib/calculate-deadline');

exports.getApplicationSaved = async (req, res) => {
	const { appeal } = req.session;

	const applicationNumber = appeal.planningApplicationNumber;
	const deadlineData = calculateDeadline.businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	res.render(APPLICATION_SAVED, {
		applicationNumber: applicationNumber,
		deadline: deadlineData,
		backLink
	});
};