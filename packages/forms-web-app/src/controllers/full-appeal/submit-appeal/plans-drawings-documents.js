const {
  documentTypes: {
    plansDrawingsSupportingDocuments: { name: documentType },
  },
} = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, DESIGN_ACCESS_STATEMENT_SUBMITTED },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentType;

const getPlansDrawingsDocuments = (req, res) => {
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
  res.render(PLANS_DRAWINGS_DOCUMENTS, {
    appealId,
    uploadedFiles,
  });
};

const postPlansDrawingsDocuments = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANS_DRAWINGS_DOCUMENTS, {
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

    if (req.body['save-and-return'] !== '') {
      req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${DESIGN_ACCESS_STATEMENT_SUBMITTED}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);
    return res.render(PLANS_DRAWINGS_DOCUMENTS, {
      appealId,
      uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getPlansDrawingsDocuments,
  postPlansDrawingsDocuments,
};
