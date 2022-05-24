const {
  documentTypes: {
    planningObligations: { name: planningObligations },
  },
} = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { PLANNING_OBLIGATION_DOCUMENTS, NEW_DOCUMENTS },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

const getPlanningObligationDocuments = (req, res) => {
  const {
    session: {
      appeal: {
        id: appealId,
        [sectionName]: {
          [taskName]: { uploadedFiles },
        },
      },
    },
  } = req;
  res.render(PLANNING_OBLIGATION_DOCUMENTS, {
    appealId,
    uploadedFiles,
  });
};

const postPlanningObligationDocuments = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANNING_OBLIGATION_DOCUMENTS, {
      appealId,
      uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
      errorSummary,
      errors,
    });
  }

  try {
    if (files) {
      appeal[sectionName][taskName].uploadedFiles = [];
      const fileUpload = files['file-upload'];
      const uploadedFiles = Array.isArray(fileUpload) ? fileUpload : [fileUpload];
      await Promise.all(
        uploadedFiles.map(async (file) => {
          const { id, location, size } = await createDocument(
            appeal,
            file,
            null,
            planningObligations
          );
          appeal[sectionName][taskName].uploadedFiles.push({
            id,
            name: file.name,
            fileName: file.name,
            originalFileName: file.name,
            location,
            size,
          });
        })
      );
    }

    appeal.sectionStates[sectionName].planningObligations = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(PLANNING_OBLIGATION_DOCUMENTS, {
      appealId,
      uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${NEW_DOCUMENTS}`);
};

module.exports = {
  getPlanningObligationDocuments,
  postPlanningObligationDocuments,
};
