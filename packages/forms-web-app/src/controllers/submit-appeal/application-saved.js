const { VIEW } = require('../../lib/submit-appeal/views');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');
const formatDate = require('#lib/format-date-check-your-answers');

exports.getApplicationSaved = async (req, res) => {
	const { appeal } = req.session;
	const applicationNumber = appeal.planningApplicationNumber;
	const deadlineData = calculateDeadlineFromBeforeYouStart({ appeal });

	res.render(VIEW.SUBMIT_APPEAL.APPLICATION_SAVED, {
		applicationNumber: applicationNumber,
		deadline: formatDate(deadlineData)
	});
};
