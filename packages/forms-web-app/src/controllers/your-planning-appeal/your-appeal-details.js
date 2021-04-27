const { VIEW } = require('../../lib/views');

exports.getYourAppealDetails = (req, res) => {
  const { appeal, appealLPD } = req.session;

  res.render(VIEW.YOUR_PLANNING_APPEAL.YOUR_APPEAL_DETAILS, {
    appeal,
    appealLPD,
  });
};
