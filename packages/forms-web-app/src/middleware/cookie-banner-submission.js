const { COOKIE_POLICY_KEY, DEFAULT_COOKIE_POLICY } = require('../lib/cookies');

const validCookieBannerChoices = ['accept', 'reject'];

/**
 * Handles app-wide submission of the cookie consent banner.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  // not an interesting request, move along.
  if (
    typeof req.body === 'undefined' ||
    typeof req.body.cookie_banner === 'undefined' ||
    validCookieBannerChoices.includes(req.body.cookie_banner) === false
  ) {
    return next();
  }

  // did the user click the accept or reject button.
  const acceptedCookiePolicy = req.body.cookie_banner === 'accept';

  // if already set, take the existing cookie policy as the starting point
  // or use the default cookie policy if not.
  const cookiePolicy =
    typeof req.cookies !== 'undefined' && typeof req.cookies[COOKIE_POLICY_KEY] !== 'undefined'
      ? JSON.parse(req.cookies[COOKIE_POLICY_KEY])
      : DEFAULT_COOKIE_POLICY;

  // the cookie banner only cares about he GA / usage cookie
  // https://docs.publishing.service.gov.uk/manual/cookie-consent-on-govuk.html#cookie-consent-mechanism
  const updatedCookiePolicy = {
    ...cookiePolicy,
    usage: acceptedCookiePolicy,
  };

  /**
   * Important: using `res.cookie` is only going to set cookies on the outgoing
   * response headers. This means any access of `req.cookies` during the remainder
   * of this request will not see the following two cookies.
   *
   * This makes hiding the cookie banner more difficult than it might otherwise be
   * when considering the world with JavaScript disabled. This is why `res.local`
   * is also used.
   */

  // separately, store a cookie to indicate the user accepted or rejected the policy.
  res.cookie('cookies_preferences_set', true);
  // store the current policy in cookies
  res.cookie(COOKIE_POLICY_KEY, JSON.stringify(updatedCookiePolicy), {
    encode: String,
  });

  // for the current req / res lifecycle, we now keep track of data that will help
  // in the correct display of the cookie consent banner in a non-JavaScript world.
  res.locals.acceptedCookiePolicy = acceptedCookiePolicy;
  res.locals.cookies = {
    ...req.cookies,
    cookies_preferences_set: true,
    [COOKIE_POLICY_KEY]: updatedCookiePolicy,
  };

  return next();
};
