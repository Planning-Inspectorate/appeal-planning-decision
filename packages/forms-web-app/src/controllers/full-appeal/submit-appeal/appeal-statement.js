const {
  VIEW: {
    FULL_APPEAL: { APPEAL_STATEMENT, PLANS_DRAWINGS },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'appealStatement';

const getAppealStatement = (req, res) => {
  const {
    session: {
      appeal: {
        id: appealId,
        [sectionName]: {
          [taskName]: { uploadedFile, hasSensitiveInformation },
        },
      },
    },
  } = req;
  res.render(APPEAL_STATEMENT, {
    appealId,
    uploadedFile,
    hasSensitiveInformation,
  });
};

const postAppealStatement = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
  } = req;

  appeal[sectionName][taskName].hasSensitiveInformation =
    body['does-not-include-sensitive-information'] !== 'i-confirm';

  if (Object.keys(errors).length > 0) {
    return res.render(APPEAL_STATEMENT, {
      appealId,
      uploadedFile: appeal[sectionName][taskName].uploadedFile,
      hasSensitiveInformation: appeal[sectionName][taskName].hasSensitiveInformation,
      errorSummary,
      errors,
    });
  }

  try {
    if (files) {
      const document = await createDocument(appeal, files['file-upload'], null, taskName);
      appeal[sectionName][taskName].uploadedFile = {
        id: document.id,
        name: files['file-upload'].name,
        fileName: files['file-upload'].name,
        originalFileName: files['file-upload'].name,
        location: document.location,
        size: document.size,
      };
    }

    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(APPEAL_STATEMENT, {
      appealId,
      uploadedFile: appeal[sectionName][taskName].uploadedFile,
      hasSensitiveInformation: appeal[sectionName][taskName].hasSensitiveInformation,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${PLANS_DRAWINGS}`);
};

module.exports = {
  getAppealStatement,
  postAppealStatement,
};
