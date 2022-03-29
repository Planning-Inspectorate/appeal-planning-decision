const {
  constants: {
    APPLICATION_DECISION: { NODECISIONRECEIVED },
  },
} = require('@pins/business-rules');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DECISION_LETTER, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'designAccessStatement';

const getDesignAccessStatement = (req, res) => {
  const {
    session: {
      appeal: {
        id: appealId,
        [sectionName]: {
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;

  res.render(DESIGN_ACCESS_STATEMENT, {
    appealId,
    uploadedFile,
  });
};

const postDesignAccessStatement = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: {
        id: appealId,
        eligibility: { applicationDecision },
        [sectionName]: {
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DESIGN_ACCESS_STATEMENT, {
      appealId,
      uploadedFile,
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

    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(DESIGN_ACCESS_STATEMENT, {
      appealId,
      uploadedFile,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return applicationDecision === NODECISIONRECEIVED
    ? res.redirect(`/${TASK_LIST}`)
    : res.redirect(`/${DECISION_LETTER}`);
};

module.exports = {
  getDesignAccessStatement,
  postDesignAccessStatement,
};
