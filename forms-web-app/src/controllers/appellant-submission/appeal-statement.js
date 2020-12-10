const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'yourAppealSection';
const taskName = 'appealStatement';

exports.getAppealStatement = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
    appeal: req.session.appeal,
  });
};

exports.postAppealStatement = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
      appeal: req.session.appeal || {},
      errors,
      errorSummary,
    });
    return;
  }

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.uploadedFile = req.files &&
    req.files['appeal-upload'] && {
      name: req.files['appeal-upload'].name,
    };

  if (body['does-not-include-sensitive-information'] === 'i-confirm') {
    try {
      task.hasSensitiveInformation = false;
      appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
      req.session.appeal = await createOrUpdateAppeal(appeal);
    } catch (e) {
      logger.error(e);
      res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: '#' }],
      });
      return;
    }

    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`);
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`);
};
