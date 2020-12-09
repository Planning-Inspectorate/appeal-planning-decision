const { VIEW } = require('../../lib/views');

// const sectionName = 'appealSiteSection';
// const taskName = 'siteOwnership';

exports.getSiteOwnership = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
    appeal: req.session.appeal,
  });
};
