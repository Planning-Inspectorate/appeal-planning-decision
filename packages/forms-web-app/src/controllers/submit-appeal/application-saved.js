const { VIEW } = require('../../lib/submit-appeal/views');
const { calculateDeadline } = require('../../lib/calculate-deadline');
const { chooseAppropriateTaskList } = require('../../lib/choose-appropriate-task-list');

exports.getApplicationSaved = async (req, res) => {
	const { appeal } = req.session;
	const applicationNumber = appeal.planningApplicationNumber;
	const deadlineData = calculateDeadline.businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	const taskListUrl = chooseAppropriateTaskList(appeal);

	res.render(VIEW.SUBMIT_APPEAL.APPLICATION_SAVED, {
		applicationNumber: applicationNumber,
		deadline: deadlineData,
		taskListUrl
	});
};
