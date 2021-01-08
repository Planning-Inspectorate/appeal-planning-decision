const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { getNextUncompletedTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = 'originalApplication';

exports.getUploadApplication = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
    appeal: req.session.appeal,
  });
};

exports.postUploadApplication = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    /* istanbul ignore next */
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
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
      if ('application-upload' in req.files) {
        const document = await createDocument(appeal, req.files['application-upload']);

        appeal[sectionName][taskName].uploadedFile = {
          id: document.id,
          name: req.files['application-upload'].name,
        };
      }
    }

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
