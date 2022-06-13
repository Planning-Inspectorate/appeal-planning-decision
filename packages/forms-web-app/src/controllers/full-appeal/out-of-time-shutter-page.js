const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
  const { appeal } = req.session;
  const { appealDeadline, appealPeriod } = appeal.eligibility;

  const appealPeriodToBeDisplayed = appealPeriod === '181 days' ? '6 months' : appealPeriod;

  return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
    appealDeadline,
    appealPeriodToBeDisplayed,
  });
};

module.exports = {
  getOutOfTimeShutterPage,
};
