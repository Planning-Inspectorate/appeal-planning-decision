//TODO refactor to eliminate duplication with controllers/submit-appeal/application-saved.js
const { businessRulesDeadline } = require('../../lib/calculate-deadline');

exports.getApplicationSaved = async (req, res) => {
	const { appeal } = req.session;

	const applicationNumber = appeal.planningApplicationNumber;

	const deadlineData = businessRulesDeadline(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	res.render('appeal-householder-decision/application-saved', {
		applicationNumber: applicationNumber,
		deadline: deadlineData
	});
};
