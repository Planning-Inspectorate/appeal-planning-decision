const { VIEW } = require('../lib/views');
const {
  addFilesToSession,
  fileErrorSummary,
  fileUploadNunjucksVariables,
  deleteFile,
} = require('../lib/file-upload-helpers');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getUploadPlans = (req, res) => {
  res.render(VIEW.UPLOAD_PLANS, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    uploadedFiles: [],
  });
};

exports.postUploadPlans = async (req, res) => {
  const documents = req.body?.files?.documents || [];

  const { delete: deleteId = '', errors = {}, submit = '' } = req.body;

  // Chance for delete to be triggered due to non-JS solution. delete will be set to value of filename if button clicked
  if (deleteId) {
    req.log.debug({ deleteId }, 'Delete ID');
    try {
      await deleteFile(deleteId, req);
    } catch (err) {
      req.log.error({ err }, 'Error deleting file from Upload Plans');
    }
  } else if (documents.length) {
    // Chance for files to be attached due to non-JS solution, these need passing into session uploaded files (with appropriate errors);
    addFilesToSession(documents, req);
  }

  const errorMessage = errors.documents && errors.documents.msg;

  const constructedErrorSummary = fileErrorSummary(errorMessage, req);

  // TODO: add handling of document upload and redirect

  if (!submit || constructedErrorSummary.length) {
    res.render(VIEW.UPLOAD_PLANS, {
      ...fileUploadNunjucksVariables(
        errorMessage,
        constructedErrorSummary,
        req.session?.uploadedFiles
      ),
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    });

    return;
  }

  // If it gets this far there are no errors and files must exist
  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
