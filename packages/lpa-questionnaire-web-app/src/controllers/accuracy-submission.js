const logger = require('../lib/logger');
const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const { renderView, redirect } = require('../util/render');

const sectionName = 'aboutAppealSection';
const taskName = 'submissionAccuracy';

exports.getAccuracySubmission = (req, res) => {
  const { submissionAccuracy } = req.session.appealReply.aboutAppealSection;

  const { accurateSubmission, inaccuracyReason } = submissionAccuracy;

  let accurateSubmissionValue = accurateSubmission;

  if (typeof accurateSubmission === 'boolean') {
    accurateSubmissionValue = accurateSubmission ? 'yes' : 'no';
  }

  const values = {
    'accurate-submission': accurateSubmissionValue,
    'inaccuracy-reason': inaccuracyReason,
  };

  renderView(res, VIEW.ACCURACY_SUBMISSION, {
    prefix: 'appeal-questionnaire',
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink ? req.session.backLink : `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
  });
};

exports.postAccuracySubmission = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'accurate-submission': body['accurate-submission'],
    'inaccuracy-reason': body['inaccuracy-reason'],
  };

  if (Object.keys(errors).length > 0) {
    renderView(res, VIEW.ACCURACY_SUBMISSION, {
      prefix: 'appeal-questionnaire',
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink ? req.session.backLink : `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  const task = appealReply[sectionName][taskName];
  task.accurateSubmission = body['accurate-submission'] === 'yes';
  task.inaccuracyReason = body['accurate-submission'] === 'no' ? body['inaccuracy-reason'] : '';
  appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
    appealReply,
    sectionName,
    taskName
  );

  try {
    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (e) {
    logger.error(e);

    renderView(res, VIEW.ACCURACY_SUBMISSION, {
      prefix: 'appeal-questionnaire',
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink ? req.session.backLink : `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: [{ text: e.toString() }],
      values,
    });

    return;
  }

  redirect(res, 'appeal-questionnaire', `${req.params.id}/${VIEW.TASK_LIST}`, req.session.backLink);
};
