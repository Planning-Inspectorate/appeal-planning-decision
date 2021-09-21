const { VIEW } = require('../../lib/views');
const getAppealSideBarDetails = require('../../lib/appeal-sidebar-details');
const { createOrUpdateAppealReply } = require('../../lib/appeal-reply-api-wrapper');
const { deleteDocument } = require('../../lib/documents-api-wrapper');
const { renderView, redirect } = require('../../util/render');

const question = {
  heading: 'Delete a supplementary planning document',
  section: 'Optional supporting documents',
  title:
    'Delete a supplementary planning document - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
};

exports.question = question;

const defineFileToDelete = (req) => {
  const rawFileInfo =
    req.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles[
      req.query.row
    ];

  return [
    [
      {
        text: rawFileInfo.documentName,
        attributes: { 'data-cy': `table-row-header-${req.query.row}` },
      },
      { text: rawFileInfo.stageReached ? 'No' : 'Yes' },
    ],
  ];
};

exports.getDeleteDocument = (req, res) => {
  const backLink = res.locals.backLink || req.session.backLink;
  const fileToDelete = defineFileToDelete(req);
  const cancelLink = `${req.protocol}://${req.headers.host}/appeal-questionnaire/${req.session.appealReply.appealId}/supplementary-documents/uploaded-documents`;

  renderView(res, VIEW.SUPPLEMENTARY_DOCUMENTS.DELETE_DOCUMENT, {
    prefix: 'appeal-questionnaire',
    cancelLink,
    fileToDelete,
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    question,
  });
};

const filterOutDeletedFile = (uploadedFiles, fileToDelete) => {
  return uploadedFiles.filter((f) => {
    return f !== fileToDelete;
  });
};

const constructNewAppealReply = (appealReply, newUploadedFiles) => {
  return {
    ...appealReply,
    optionalDocumentsSection: {
      supplementaryPlanningDocuments: {
        uploadedFiles: newUploadedFiles,
      },
    },
  };
};

exports.postDeleteDocument = async (req, res) => {
  const { appealReply } = req.session;
  const { uploadedFiles } = appealReply.optionalDocumentsSection.supplementaryPlanningDocuments;
  const fileToDelete = uploadedFiles[req.query.row];
  const newUploadedFiles = filterOutDeletedFile(uploadedFiles, fileToDelete);

  try {
    await deleteDocument(appealReply.id, fileToDelete.id);
  } catch (err) {
    req.log.error({ err }, `Error deleting file`);
    redirect(
      res,
      'appeal-questionnaire',
      `${req.session.appealReply.appealId}/${VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT}`,
      req.session.backLink
    );

    return;
  }

  await createOrUpdateAppealReply(constructNewAppealReply(appealReply, newUploadedFiles));

  if (newUploadedFiles.length < 1) {
    redirect(
      res,
      'appeal-questionnaire',
      `${req.session.appealReply.appealId}/${VIEW.SUPPLEMENTARY_DOCUMENTS.UPLOADED_DOCUMENTS}`,
      req.session.backLink
    );
    return;
  }

  redirect(
    res,
    'appeal-questionnaire',
    `${req.session.appealReply.appealId}/${VIEW.SUPPLEMENTARY_DOCUMENTS.UPLOADED_DOCUMENTS}`,
    req.session.backLink
  );
};
