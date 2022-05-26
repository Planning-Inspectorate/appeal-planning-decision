const {
  documentTypes: {
    decisionPlans: { name: documentType },
  },
} = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

const getPlansDrawings = (req, res) => {
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
  res.render(PLANS_DRAWINGS, {
    appealId,
    uploadedFiles,
  });
};

const postPlansDrawings = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANS_DRAWINGS, {
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
          const { id, location, size } = await createDocument(appeal, file, null, documentType);
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

    appeal.sectionStates[sectionName].newPlansDrawings = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(PLANS_DRAWINGS, {
      appealId,
      uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${PLANNING_OBLIGATION_PLANNED}`);
};

module.exports = {
  getPlansDrawings,
  postPlansDrawings,
};
