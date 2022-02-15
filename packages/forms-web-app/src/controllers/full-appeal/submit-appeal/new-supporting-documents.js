const {
  documentTypes: {
    otherDocuments: { name: documentType },
  },
} = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { NEW_SUPPORTING_DOCUMENTS, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

const getNewSupportingDocuments = (req, res) => {
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
  res.render(NEW_SUPPORTING_DOCUMENTS, {
    appealId,
    uploadedFiles,
  });
};

const postNewSupportingDocuments = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files,
    session: {
      appeal,
      appeal: { id: appealId },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(NEW_SUPPORTING_DOCUMENTS, {
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

    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(NEW_SUPPORTING_DOCUMENTS, {
      appealId,
      uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
};
