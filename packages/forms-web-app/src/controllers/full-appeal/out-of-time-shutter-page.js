const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
  const { appeal } = req.session;
  const appealDeadline = appeal?.eligibility?.appealDeadline;

  return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
    appealDeadline,
  });
};

module.exports = {
  getOutOfTimeShutterPage,
};
