const { documentTypes } = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { LETTER_CONFIRMING_APPLICATION, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');

const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.letterConfirmingApplication.name;

const getLetterConfirmingApplication = (req, res) => {
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
  res.render(LETTER_CONFIRMING_APPLICATION, {
    appealId,
    uploadedFile,
  });
};

const postLetterConfirmingApplication = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: {
        id: appealId,
        [sectionName]: {
          [taskName]: { uploadedFile },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(LETTER_CONFIRMING_APPLICATION, {
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
    return res.render(LETTER_CONFIRMING_APPLICATION, {
      appealId,
      uploadedFile,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
   getLetterConfirmingApplication,
   postLetterConfirmingApplication,
};