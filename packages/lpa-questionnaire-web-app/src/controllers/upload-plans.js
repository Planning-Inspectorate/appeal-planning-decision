const { VIEW } = require('../lib/views');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
  deleteFile,
  uploadFiles,
} = require('../lib/file-upload-helpers');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');

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
      req.log.error({ err }, `Error deleting ${deleteId} from Upload Plans`);
    }
  } else if (documents.length) {
    // Chance for files to be attached due to non-JS solution, these need passing into session uploaded files (with appropriate errors);
    req.session.uploadedFiles = [
      ...(req.session?.uploadedFiles || []),
      ...documents.map((doc, index) => ({
        ...doc,
        // current validation will return errors in this format
        error: errors[`files.documents[${index}]`]?.msg,
      })),
    ];
  }

  const errorMessage = errors.documents && errors.documents.msg;

  const constructedErrorSummary = fileErrorSummary(errorMessage, req.session?.uploadedFiles);

  if (!submit || constructedErrorSummary?.length) {
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

  try {
    const { appealReply } = req.session;
    const sectionName = 'requiredDocumentsSection';
    const taskName = 'plansDecision';

    const uploadedFiles = await uploadFiles(req.session?.uploadedFiles, appealReply.id);

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
    req.log.error({ err }, 'Error adding files to Upload Plans question');

    res.render(VIEW.UPLOAD_PLANS, {
      ...fileUploadNunjucksVariables(err, fileErrorSummary(err, req), req.session?.uploadedFiles),
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    });
  }
};
