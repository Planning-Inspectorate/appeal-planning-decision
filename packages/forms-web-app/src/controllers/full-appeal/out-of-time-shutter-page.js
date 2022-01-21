const { format } = require('date-fns');
const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
  const { appeal } = req.session;
  const { appealDeadline, appealPeriod } = appeal?.eligibility;

  const date = new Date(appealDeadline);

  return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
    appealDeadline: format(date, 'dd MMMM yyyy'),
    appealPeriod,
  });
};

module.exports = {
  getOutOfTimeShutterPage,
};
