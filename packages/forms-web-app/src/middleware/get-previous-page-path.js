const getPreviousPagePath = require('../lib/get-previous-page-path');

module.exports = async (req, res, next) => {
  res.locals.previousPagePath = getPreviousPagePath(req);

  return next();
};
