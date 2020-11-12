const fetch = require('node-fetch');
const config = require('../config');

/**
 * Middleware to ensure any route that needs the appeal form data can have it pre-populated when the
 * controller action is invoked.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  if (!req.session || !req.session.uuid) {
    return next();
  }

  try {
    const apiResponse = await fetch(`${config.appeals.url}/appeals/${req.session.uuid}`);
    req.session.appeal = await apiResponse.json();
  } catch (e) {
    req.session.appeal = {};
  }

  return next();
};
