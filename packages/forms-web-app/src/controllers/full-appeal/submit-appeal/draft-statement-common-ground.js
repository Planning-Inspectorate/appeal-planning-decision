const {
  documentTypes: {
    draftStatementOfCommonGround: { name: taskName },
  },
} = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { DRAFT_STATEMENT_COMMON_GROUND, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDecisionSection';

const getDraftStatementCommonGround = (req, res) => {
  const {
    session: {
      appeal: {
        id: appealId,
        [sectionName]: {
          procedureType,
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;
  res.render(DRAFT_STATEMENT_COMMON_GROUND, {
    appealId,
    uploadedFile,
    procedureType,
  });
};

const postDraftStatementCommonGround = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: {
        id: appealId,
        [sectionName]: {
          procedureType,
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DRAFT_STATEMENT_COMMON_GROUND, {
      appealId,
      uploadedFile,
      procedureType,
      errorSummary,
      errors,
    });
  }

  try {
    if (files) {
      const { id, location, size } = await createDocument(
        appeal,
        files['file-upload'],
        null,
        taskName
      );

      appeal[sectionName][taskName].uploadedFile = {
        id,
        name: files['file-upload'].name,
        fileName: files['file-upload'].name,
        originalFileName: files['file-upload'].name,
        location,
        size,
      };
    }

    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(DRAFT_STATEMENT_COMMON_GROUND, {
      appealId,
      uploadedFile: appeal[sectionName][taskName].uploadedFile,
      procedureType,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getDraftStatementCommonGround,
  postDraftStatementCommonGround,
};
