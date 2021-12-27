const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
  const {
    appeal: {
      eligibility: { appealDeadline },
    },
  } = req.session;

  return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
    appealDeadline,
  });
};

module.exports = {
  getOutOfTimeShutterPage,
};
