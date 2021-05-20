const { VIEW } = require('../lib/views');

module.exports = async (req, res, next) => {
  res.locals.previousPagePath =
    req.session.backLink || `/${req.session.appealId}/${VIEW.TASK_LIST}`;

  return next();
};
