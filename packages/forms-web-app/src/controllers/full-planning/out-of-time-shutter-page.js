const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
  const { appealDeadline } = req.session;

  if (typeof appealDeadline !== 'undefined') {
    return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
      appealDeadline,
    });
  }

  return res.redirect('/page-error');
};

module.exports = {
  getOutOfTimeShutterPage,
};
