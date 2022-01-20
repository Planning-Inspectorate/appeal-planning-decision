const {
  VIEW: {
    FULL_APPEAL: { APPLICATION_FORM, APPLICATION_NUMBER },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const getApplicationForm = (req, res) => {
  const {
    session: { appeal },
    sectionName,
    taskName,
  } = req;
  res.render(APPLICATION_FORM, {
    appealId: appeal.id,
    uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
  });
};

const postApplicationForm = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
    sectionName,
    taskName,
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(APPLICATION_FORM, {
      appealId: appeal.id,
      uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
      errorSummary,
      errors,
    });
  }

  try {
    if (files) {
      const document = await createDocument(appeal, files['file-upload'], null, taskName);

      if (!appeal[sectionName][taskName]) {
        appeal[sectionName][taskName] = {};
      }

      appeal[sectionName][taskName].uploadedFile = {
        id: document.id,
        name: files['file-upload'].name,
        fileName: files['file-upload'].name,
        originalFileName: files['file-upload'].name,
        location: document.location,
        size: document.size,
      };
    }

    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(APPLICATION_FORM, {
      appealId,
      uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${APPLICATION_NUMBER}`);
};

module.exports = {
  getApplicationForm,
  postApplicationForm,
};
