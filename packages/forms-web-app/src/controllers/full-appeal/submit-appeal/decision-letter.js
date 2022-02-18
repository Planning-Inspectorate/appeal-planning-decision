const {
  VIEW: {
    FULL_APPEAL: { DECISION_LETTER, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'decisionLetter';

const getDecisionLetter = (req, res) => {
  const {
    session: {
      appeal: {
        id: appealId,
        [sectionName]: {
          designAccessStatement: { isSubmitted: isDesignAccessStatementSubmitted },
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;
  res.render(DECISION_LETTER, {
    appealId,
    uploadedFile,
    isDesignAccessStatementSubmitted,
  });
};

const postDecisionLetter = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: {
        id: appealId,
        [sectionName]: {
          designAccessStatement: { isSubmitted: isDesignAccessStatementSubmitted },
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DECISION_LETTER, {
      appealId,
      uploadedFile,
      isDesignAccessStatementSubmitted,
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
    return res.render(DECISION_LETTER, {
      appealId,
      uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
      isDesignAccessStatementSubmitted,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getDecisionLetter,
  postDecisionLetter,
};
