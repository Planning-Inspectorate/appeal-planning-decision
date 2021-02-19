const { VIEW } = require('../../lib/views');

exports.getConfirmation = (req, res) => {
  const appellantEmail = req.session && req.session.appeal && req.session.appeal['appellant-email'];
  res.render(VIEW.APPELLANT_SUBMISSION.CONFIRMATION, {
    appellantEmail,
    appealId: req.session.appeal.id,
  });
};
