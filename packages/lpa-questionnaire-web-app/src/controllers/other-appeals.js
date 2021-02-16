const logger = require('../lib/logger');
const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');

const sectionName = 'aboutAppealSection';
const taskName = 'otherAppeals';

exports.getOtherAppeals = (req, res) => {
  const otherAppealsSection = req.session.appealReply.aboutAppealSection.otherAppeals;

  let { adjacentAppeals } = otherAppealsSection;

  if (typeof adjacentAppeals === 'boolean') {
    adjacentAppeals = adjacentAppeals ? 'yes' : 'no';
  }

  const values = {
    'appeal-reference-numbers': otherAppealsSection.appealReferenceNumbers,
    'adjacent-appeals': adjacentAppeals,
  };

  res.render(VIEW.OTHER_APPEALS, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
  });
};

exports.postOtherAppeals = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'appeal-reference-numbers': body['appeal-reference-numbers'],
    'adjacent-appeals': body['adjacent-appeals'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.OTHER_APPEALS, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  const task = appealReply[sectionName][taskName];
  task.adjacentAppeals = body['adjacent-appeals'] === 'yes';
  task.appealReferenceNumbers =
    body['adjacent-appeals'] === 'yes' ? body['appeal-reference-numbers'] : '';
  appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
    appealReply,
    sectionName,
    taskName
  );

  try {
    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.OTHER_APPEALS, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: [{ text: e.toString() }],
      values,
    });

    return;
  }

  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
