const { VIEW } = require('../lib/views');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
  uploadFiles,
} = require('../lib/file-upload-helpers');
const { deleteDocument } = require('../lib/documents-api-wrapper');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');

const docArrayFromInputString = (tempDocsString) => {
  return tempDocsString && typeof tempDocsString === 'string'
    ? tempDocsString.match(/{.*?}/g).map((docString) => JSON.parse(docString))
    : [];
};

exports.getUpload = (req, res) => {
  const { sectionName, taskName, view } = res.locals.routeInfo;

  let uploadedFiles;

  if (!req.session.appealReply[sectionName][taskName]) {
    req.session.appealReply[sectionName][taskName] = { uploadFiles: [] };
  } else {
    uploadedFiles = req.session.appealReply[sectionName][taskName].uploadedFiles;
  }

  res.render(view, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    ...fileUploadNunjucksVariables(null, null, uploadedFiles),
  });
};

exports.postUpload = async (req, res) => {
  const { sectionName, taskName, view, name } = res.locals.routeInfo;
  const { appealReply } = req.session;
  const documents = req.body?.files?.documents || [];
  const { delete: deleteId = '', errors = {}, submit = '' } = req.body;
  const backLink = req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`;

  let uploadedFiles = docArrayFromInputString(req.body.tempDocs);

  let errorMessage;

  // Chance for delete to be triggered due to non-JS solution. delete will be set to value of filename if button clicked
  if (deleteId) {
    try {
      // deleteId will be 'undefined' if file upload error
      if (deleteId !== 'undefined') await deleteDocument(appealReply.id, deleteId);
    } catch (err) {
      req.log.error({ err }, `Error deleting ${deleteId} from ${name}`);
    } finally {
      uploadedFiles = uploadedFiles.filter((file) => file.id !== deleteId);
    }
  } else if (documents.length) {
    // Chance for files to be attached due to non-JS solution, these need to be uploaded (with appropriate errors);
    try {
      const newFiles = await uploadFiles(
        documents.map((doc, index) => ({
          ...doc,
          // current validation will return errors in this format
          error: errors[`files.documents[${index}]`]?.msg,
        })),
        req.session?.appealReply?.id
      );

      uploadedFiles = [
        ...uploadedFiles,
        ...newFiles.map(({ id, name: fileName, error }) => ({
          id,
          name: fileName,
          error,
        })),
      ];
    } catch (err) {
      req.log.error({ err }, 'Error uploading files to documents service');
      errorMessage = err;
    }
  }

  errorMessage = errorMessage || (errors.documents && errors.documents.msg);

  const constructedErrorSummary = fileErrorSummary(errorMessage, uploadedFiles);

  if (!submit || constructedErrorSummary?.length) {
    res.render(view, {
      ...fileUploadNunjucksVariables(errorMessage, constructedErrorSummary, uploadedFiles),
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink,
    });

    return;
  }

  try {
    appealReply[sectionName][taskName].uploadedFiles = uploadedFiles;

    appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
      appealReply,
      sectionName,
      taskName
    );

    req.session.appealReply = await createOrUpdateAppealReply(appealReply);

    // If it gets this far there are no errors and files must exist
    res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
  } catch (err) {
    req.log.error({ err }, `Error adding files to ${name} question`);

    res.render(view, {
      ...fileUploadNunjucksVariables(err, fileErrorSummary(err, req), uploadedFiles),
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink,
    });
  }
};
