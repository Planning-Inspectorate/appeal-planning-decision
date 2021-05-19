/**
 * Take any flash messages from the current request and make them available globally to nunjucks.
 *
 * @param env
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = (env) => (req, res, next) => {
  env.addGlobal('flashMessages', res.locals.flashMessages || []);

  next();
};
