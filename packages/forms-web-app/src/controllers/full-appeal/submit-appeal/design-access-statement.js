const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DECISION_LETTER },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const getDesignAccessStatement = (req, res) => {
  const {
    session: {
      appeal,
      appeal: { id: appealId },
    },
    sectionName,
    taskName,
  } = req;

  res.render(DESIGN_ACCESS_STATEMENT, {
    appealId,
    uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
  });
};

const postDesignAccessStatement = async (req, res) => {
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
    return res.render(DESIGN_ACCESS_STATEMENT, {
      appealId,
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
    return res.render(DESIGN_ACCESS_STATEMENT, {
      appealId,
      uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${DECISION_LETTER}`);
};

module.exports = {
  getDesignAccessStatement,
  postDesignAccessStatement,
};
