const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getUploadPlans = (req, res) => {
  res.render(VIEW.UPLOAD_PLANS, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    uploadedFiles: [],
  });
};
