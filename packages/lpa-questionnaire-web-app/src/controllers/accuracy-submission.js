const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getAccuracySubmission = (req, res) => {
  res.render(VIEW.ACCURACY_SUBMISSION, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
  });
};

exports.postAccuracySubmission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'accurate-submission': body['accurate-submission'],
    'inaccuracy-reason': body['inaccuracy-reason'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ACCURACY_SUBMISSION, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
