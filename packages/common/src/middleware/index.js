const flashMessageCleanup = require('./flash-message-cleanup');
const flashMessageToNunjucks = require('./flash-message-to-nunjucks');
const removeUnwantedCookies = require('./remove-unwanted-cookies');

module.exports = {
  flashMessageCleanup,
  flashMessageToNunjucks,
  removeUnwantedCookies,
};
