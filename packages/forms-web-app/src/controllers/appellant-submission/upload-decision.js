const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { getTaskStatus } = require('../../services/task.service');
const { getNextUncompletedTask } = require('../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = 'decisionLetter';

exports.getUploadDecision = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
    appeal: req.session.appeal,
  });
};

exports.postUploadDecision = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
      appeal: req.session.appeal || {},
      errors,
      errorSummary,
    });
    return;
  }

  const { appeal } = req.session;

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    if ('files' in req && req.files !== null) {
      if ('decision-upload' in req.files) {
        const document = await createDocument(appeal, req.files['decision-upload']);

        appeal[sectionName][taskName].uploadedFile = {
          id: document.id,
          name: req.files['decision-upload'].name,
        };
      }
    }

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
