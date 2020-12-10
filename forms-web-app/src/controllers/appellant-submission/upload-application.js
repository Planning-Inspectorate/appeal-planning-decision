const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
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
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
      appeal: req.session.appeal || {},
      errors,
      errorSummary,
    });
    return;
  }

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.uploadedFile = req.files &&
    req.files['application-upload'] && {
      name: req.files['application-upload'].name,
    };

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
      appeal,
      errors,
      errorSummary: {
        a: 'b',
      },
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`);
};
