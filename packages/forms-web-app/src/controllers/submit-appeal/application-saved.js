const { VIEW } = require('../../lib/submit-appeal/views');
const { calculateDeadline } = require('../../lib/calculate-deadline');

exports.getApplicationSaved = async (req, res) => {
  const { appeal } = req.session;
  const applicationNumber = appeal.planningApplicationDocumentsSection.applicationNumber;
  const deadlineData = calculateDeadline.fullAppealApplication(appeal.decisionDate);
  res.render(VIEW.SUBMIT_APPEAL.APPLICATION_SAVED, {
    applicationNumber: applicationNumber,
    deadline: deadlineData,
  });
};
