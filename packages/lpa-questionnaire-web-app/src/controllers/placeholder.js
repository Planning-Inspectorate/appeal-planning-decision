const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getPlaceholder = (req, res) => {
  res.render(VIEW.PLACEHOLDER, {
    appeal: getAppealSideBarDetails(req.session.appeal),
  });
};
