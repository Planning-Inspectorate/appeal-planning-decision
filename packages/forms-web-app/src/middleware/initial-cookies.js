const { DEFAULT_COOKIE_POLICY } = require('../lib/cookies');

const cookiePolicyKey = 'cookie_policy';

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
