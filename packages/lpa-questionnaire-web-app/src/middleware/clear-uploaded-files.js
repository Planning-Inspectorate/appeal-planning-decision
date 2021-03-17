/**
 * Middleware to clear uploaded files session to prepare it for fresh uploads
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = async (req, res, next) => {
  if (!req.session) {
    return next();
  }

  req.session.uploadedFiles = [];

  return next();
};
