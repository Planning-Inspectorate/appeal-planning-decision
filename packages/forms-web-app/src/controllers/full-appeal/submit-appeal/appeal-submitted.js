const {
  VIEW: {
    FULL_APPEAL: { APPEAL_SUBMITTED: currentPage },
  },
} = require('../../../lib/full-appeal/views');

exports.getAppealSubmitted = (req, res) => {
  req.session.appeal.appealType = '1005';
  const appellantEmail = req.session && req.session.appeal && req.session.appeal['appellant-email'];
  const appealId = req.session.appeal.id;
  req.session.appeal = null;

  res.render(currentPage, {
    appellantEmail,
    appealId,
  });
};
