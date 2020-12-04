const { VIEW } = require('../../lib/views');

exports.getSiteOwnership = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
    appeal: req.session.appeal,
  });
};
