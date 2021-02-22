const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getExtraConditions = (req, res) => {
  res.render(VIEW.EXTRA_CONDITIONS, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
  });
};
