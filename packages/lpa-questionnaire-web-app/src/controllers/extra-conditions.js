const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const { renderView, redirect } = require('../util/render');

const sectionName = 'aboutAppealSection';
const taskName = 'extraConditions';

exports.getExtraConditions = (req, res) => {
  const extraConditionsSection = req.session.appealReply.aboutAppealSection.extraConditions;

  let { hasExtraConditions } = extraConditionsSection;

  if (typeof hasExtraConditions === 'boolean') {
    hasExtraConditions = hasExtraConditions ? 'yes' : 'no';
  }

  const values = {
    'has-extra-conditions': hasExtraConditions,
    'extra-conditions-text': extraConditionsSection.extraConditions,
  };

  renderView(res, VIEW.EXTRA_CONDITIONS, {
    prefix: 'appeal-questionnaire',
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink ? req.session.backLink : `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
  });
};

exports.postExtraConditions = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'has-extra-conditions': body['has-extra-conditions'],
    'extra-conditions-text': body['extra-conditions-text'],
  };

  if (Object.keys(errors).length > 0) {
    renderView(res, VIEW.EXTRA_CONDITIONS, {
      prefix: 'appeal-questionnaire',
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  const task = appealReply[sectionName][taskName];
  task.hasExtraConditions = body['has-extra-conditions'] === 'yes';
  task.extraConditions =
    body['has-extra-conditions'] === 'yes' ? body['extra-conditions-text'] : '';
  appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
    appealReply,
    sectionName,
    taskName
  );

  try {
    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (err) {
    req.log.error({ err }, 'Error creating or updating appeal');

    renderView(res, VIEW.EXTRA_CONDITIONS, {
      prefix: 'appeal-questionnaire',
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: [{ text: err.toString() }],
      values,
    });

    return;
  }

  redirect(res, 'appeal-questionnaire', `${req.params.id}/${VIEW.TASK_LIST}`, req.session.backLink);
};
