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
const { renderView, redirect } = require('../util/render');

const docArrayFromInputString = (tempDocsString) => {
  return tempDocsString && typeof tempDocsString === 'string'
    ? tempDocsString.match(/{.*?}/g).map((docString) => JSON.parse(docString))
    : [];
};

exports.getUpload = (req, res) => {
  const { sectionName, taskName, view } = res.locals.routeInfo;

  let uploadedFiles;
  let appealReplyId;

  if (!req.session.appealReply[sectionName][taskName]) {
    req.session.appealReply[sectionName][taskName] = { uploadFiles: [] };
  } else {
    uploadedFiles = req.session.appealReply[sectionName][taskName].uploadedFiles;
    appealReplyId = req.session.appealReply.id;
  }

  renderView(res, VIEW.DEVELOPMENT_PLAN, {
    prefix: 'appeal-questionnaire',
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink ? req.session.backLink : `/${req.params.id}/${VIEW.TASK_LIST}`,
    ...fileUploadNunjucksVariables(null, null, uploadedFiles),
    appealReplyId,
  });
};

exports.postUpload = async (req, res) => {
  const { sectionName, taskName, view, name } = res.locals.routeInfo;
  const { appealReply } = req.session;
  const { appealReplyId } = appealReply;
  const documents = req.body?.files?.documents || [];
  const { delete: deleteId = '', errors = {}, submit = '' } = req.body;
  const backLink = req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`;

  const uploadedFiles = docArrayFromInputString(req.body.tempDocs);
  let validFiles = [];
  const erroredFiles = [];

  let errorMessage;

  // Remove errored files
  uploadedFiles.forEach((uploadedFile) => {
    if (uploadedFile.error && uploadedFile.error.length > 0) {
      erroredFiles.push({ name: 'documents', error: uploadedFile.error });
    } else {
      validFiles.push(uploadedFile);
    }
  });

  // Chance for delete to be triggered due to non-JS solution. delete will be set to value of filename if button clicked
  if (deleteId) {
    try {
      // deleteId will be 'undefined' if file upload error
      if (deleteId !== 'undefined') await deleteDocument(appealReply.id, deleteId);
    } catch (err) {
      req.log.error({ err }, `Error deleting ${deleteId} from ${name}`);
    } finally {
      validFiles = validFiles.filter((file) => file.id !== deleteId);
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

      validFiles = [
        ...validFiles,
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

  let constructedErrorSummary;

  if (typeof erroredFiles !== 'undefined' && erroredFiles.length > 0) {
    constructedErrorSummary = fileErrorSummary('', erroredFiles);
  } else {
    constructedErrorSummary = fileErrorSummary(errorMessage, validFiles);
  }

  try {
    appealReply[sectionName][taskName].uploadedFiles = validFiles;

    appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
      appealReply,
      sectionName,
      taskName
    );

    req.session.appealReply = await createOrUpdateAppealReply(appealReply);

    if (!submit || constructedErrorSummary?.length) {
      renderView(res, view, {
        prefix: 'appeal-questionnaire',
        ...fileUploadNunjucksVariables(errorMessage, constructedErrorSummary, validFiles),
        appeal: getAppealSideBarDetails(req.session.appeal),
        backLink,
        appealReplyId,
      });
    } else {
      redirect(
        res,
        'appeal-questionnaire',
        `${req.params.id}/${VIEW.TASK_LIST}`,
        req.session.backLink
      );
    }
    // If it gets this far there are no errors and files must exist
  } catch (err) {
    req.log.error({ err }, `Error adding files to ${name} question`);

    renderView(res, view, {
      prefix: 'appeal-questionnaire',
      ...fileUploadNunjucksVariables(errorMessage, constructedErrorSummary, validFiles),
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink,
      appealReplyId,
    });
  }
};
