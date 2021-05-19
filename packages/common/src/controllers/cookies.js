const { VIEW } = require('../lib/views');
const appConfig = require('../config');
const cookieConfig = require('../lib/client-side/cookie/cookie-config');
// const getPreviousPagePath = require('../lib/get-previous-page-path');
const { addFlashMessage } = require('../lib/flash-message');
const { removeUnwantedCookies } = require('../lib/remove-unwanted-cookies');

const getPreviousPagePath = () => '/';

const getExistingCookiePolicy = (req) => {
  let cookiePolicy = {};

  try {
    cookiePolicy =
      req.cookies &&
      req.cookies[cookieConfig.COOKIE_POLICY_KEY] &&
      JSON.parse(req.cookies[cookieConfig.COOKIE_POLICY_KEY]);
  } catch (e) {
    req.log.warn(e, 'Get cookies.');
  }

  return cookiePolicy;
};

exports.getCookies = (req, res) => {
  res.render(VIEW.COOKIES, {
    cookiePolicy: getExistingCookiePolicy(req),
    displayCookieBanner: false,
    previousPagePath: getPreviousPagePath(req),
  });
};

exports.postCookies = (req, res) => {
  const { body } = req;
  const { errors = {} } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.COOKIES, {
      cookiePolicy: getExistingCookiePolicy(req),
      displayCookieBanner: false,
    });
    return;
  }

  if (typeof body['usage-cookies'] === 'undefined') {
    res.redirect(`/${VIEW.COOKIES}`);
    return;
  }

  const existingCookiePolicy = getExistingCookiePolicy(req) || cookieConfig.DEFAULT_COOKIE_POLICY;

  const updatedCookiePolicy = {
    ...existingCookiePolicy,
    usage: body['usage-cookies'] === 'on',
  };

  res.cookie(cookieConfig.COOKIE_POLICY_KEY, JSON.stringify(updatedCookiePolicy), {
    encode: String,
    expires: new Date(Date.now() + appConfig.cookies.expiresTimerInMilliseconds),
    secure: appConfig.isProduction,
  });

  addFlashMessage(req, {
    type: 'success',
    template: {
      path: `${VIEW.MESSAGES.COOKIES_UPDATED_SUCCESSFULLY}.njk`,
      vars: {
        previousPagePath: body.previous_page_path || '/',
      },
    },
  });

  if (body['usage-cookies'] === 'off') {
    removeUnwantedCookies(req, res);
  }

  res.redirect(`/${VIEW.COOKIES}`);
};
