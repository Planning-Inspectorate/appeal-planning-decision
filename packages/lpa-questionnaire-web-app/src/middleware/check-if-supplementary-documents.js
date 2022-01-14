/**
 * Middleware to redirect uploaded-documents to add-document if no supplementary documents exist
 * @param req
 * @param res
 * @param next
 */
/* istanbul ignore next */
module.exports = async (req, res, next) => {
  const { uploadedFiles } =
    req.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments;

  if (uploadedFiles.length < 1) {
    res.redirect(
      `/appeal-questionnaire/${req.session.appealReply.appealId}/supplementary-documents`
    );
    return false;
  }

  return next();
};
