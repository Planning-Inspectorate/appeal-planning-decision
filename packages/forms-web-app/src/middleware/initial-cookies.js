const { COOKIE_POLICY_KEY, DEFAULT_COOKIE_POLICY } = require('../lib/cookies');

/**
 * Middleware function to set the expected cookies for all site requests.
 */
module.exports = async (req, res, next) => {
  if (req.cookies && typeof req.cookies[COOKIE_POLICY_KEY] === 'undefined') {
    res.cookie(COOKIE_POLICY_KEY, JSON.stringify(DEFAULT_COOKIE_POLICY), {
      encode: String,
    });

    /*
     * `res.cookie` only takes effect for the next request, meaning calls to `reQ.cookies` later
     * in the middleware chain will not have access to the cookie set above.
     *
     * This feels like a hack. Open to a better implementation.
     */
    res.locals.cookies = {
      ...req.cookies,
      [COOKIE_POLICY_KEY]: DEFAULT_COOKIE_POLICY,
    };
  }

  return next();
};
