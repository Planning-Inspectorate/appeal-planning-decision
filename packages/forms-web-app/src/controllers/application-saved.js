const {
	VIEW: { APPLICATION_SAVED }
} = require('../lib/views');
const { businessRulesDeadline } = require('../lib/calculate-deadline');

exports.getApplicationSaved = async (req, res) => {
	const { appeal } = req.session;

	const { typeOfPlanningApplication } = appeal;
	const applicationNumber = appeal.planningApplicationNumber;
	const deadlineData = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	res.render(APPLICATION_SAVED, {
		applicationNumber: applicationNumber,
		deadline: deadlineData,
		typeOfPlanningApplication
	});
};
