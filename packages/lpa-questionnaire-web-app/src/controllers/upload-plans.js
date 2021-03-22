const { VIEW } = require('../lib/views');
const { getErrorHtml, getSuccessHtml } = require('../lib/file-upload-helpers');
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

  const { delete: deleteFile = '', errors = {}, submit = '' } = req.body;

  // Chance for delete to be triggered due to non-JS solution. delete will be set to value of filename if button clicked
  if (deleteFile) {
    // TODO: add handling for deletion from DB and doc store as part of AS-1538
    const file = req.session.uploadedFiles?.find((upload) => upload.name === deleteFile);

    if (file) {
      req.session.uploadedFiles = req.session.uploadedFiles.filter(
        (upload) => upload.name !== deleteFile
      );
    }
  } else if (documents.length) {
    // Chance for files to be attached due to non-JS solution, these need passing into session uploaded files (with appropriate errors);
    req.session.uploadedFiles = [
      ...(req.session.uploadedFiles || []),
      ...documents.map((doc, index) => ({
        ...doc,
        error: errors[`files.documents[${index}]`]?.msg,
      })),
    ];
  }

  const errorMessage = errors.documents && errors.documents.msg;

  // due to the way express validator handles errors, and the fact that file errors persist after a post we need to build a custom summary here
  const constructedErrorSummary = [
    ...(errorMessage
      ? [
          {
            href: '#documents',
            text: errorMessage,
          },
        ]
      : []),
    ...(req.session.uploadedFiles
      ? req.session.uploadedFiles.reduce((errorsOutput, file) => {
          if (file.error)
            errorsOutput.push({
              href: `#${file.name}`,
              text: file.error,
            });
          return errorsOutput;
        }, [])
      : []),
  ];

  // TODO: add handling of document upload and redirect

  if (!submit || constructedErrorSummary.length) {
    res.render(VIEW.UPLOAD_PLANS, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errorMessage,
      errorSummary: constructedErrorSummary,
      uploadedFiles: req.session.uploadedFiles?.map((doc) => ({
        deleteButton: {
          text: 'Delete',
        },
        fileName: doc.name,
        originalFileName: doc.name,
        message: {
          html: doc.error ? getErrorHtml(doc.error) : getSuccessHtml(doc.name),
        },
      })),
    });

    return;
  }

  // If it gets this far there are no errors and files must exist
  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
