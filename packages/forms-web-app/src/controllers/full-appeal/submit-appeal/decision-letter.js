const {
  VIEW: {
    FULL_APPEAL: { DECISION_LETTER, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

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

    if (req.body['save-and-return'] !== '') {
      req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${TASK_LIST}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);
    return res.render(DECISION_LETTER, {
      appealId,
      uploadedFile: appeal[sectionName][taskName]?.uploadedFile,
      isDesignAccessStatementSubmitted,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getDecisionLetter,
  postDecisionLetter,
};
