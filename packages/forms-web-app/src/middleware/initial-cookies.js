const { DEFAULT_COOKIE_POLICY } = require('../lib/cookies');

const cookiePolicyKey = 'cookie_policy';

/**
 * Middleware function to give access to cookies via Nunjucks globals.
 *
 * This feels like a hack, and that there should be an easier way to get access to this information.
 * The suggested approach from reading via github issues and google searches was to use
 * `res.locals`, however this doesn't seem to work.
 *
 * Open to a nicer implementation.
 *
 * @param env
 */
module.exports = (env) => async (req, res, next) => {
  if (req.cookies && typeof req.cookies[cookiePolicyKey] === 'undefined') {
    res.cookie(cookiePolicyKey, JSON.stringify(DEFAULT_COOKIE_POLICY), {
      encode: String,
    });

    env.addGlobal('cookies', {
      ...req.cookies,
      [cookiePolicyKey]: JSON.stringify(DEFAULT_COOKIE_POLICY),
    });
  } else {
    env.addGlobal('cookies', req.cookies);
  }

  return next();
};
