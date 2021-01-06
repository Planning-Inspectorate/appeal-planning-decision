const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { createDocument } = require('../../lib/documents-api-wrapper');
const logger = require('../../lib/logger');
const { getNextUncompletedTask } = require('../../services/task.service');
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
      appeal: req.session.appeal,
      errors,
      errorSummary,
    });
    return;
  }

  if (body['does-not-include-sensitive-information'] !== 'i-confirm') {
    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`);
    return;
  }

  const { appeal } = req.session;

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.yourAppealSection.appealStatement.hasSensitiveInformation = false;
    if ('files' in req && req.files !== null) {
      if ('appeal-upload' in req.files) {
        const document = await createDocument(appeal, req.files['appeal-upload']);

        appeal[sectionName][taskName].uploadedFile = {
          id: document.id,
          name: req.files['appeal-upload'].name,
        };
      }
    }

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

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
