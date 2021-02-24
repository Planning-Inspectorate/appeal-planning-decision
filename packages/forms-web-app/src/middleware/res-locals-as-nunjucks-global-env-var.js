/**
 * Middleware function to give access to useful objects via Nunjucks globals.
 *
 * From what I have read, `res.locals` *should* be available by default. But it isn't, so
 * this is a workaround.
 *
 * Open to a nicer implementation.
 *
 * @param env
 */
module.exports = (env) => async (req, res, next) => {
  env.addGlobal('res_locals', res.locals || {});
  // Be careful here. Any cookies set on `res` will not be immediately available.
  env.addGlobal('cookies', req.cookies || {});

  return next();
};
