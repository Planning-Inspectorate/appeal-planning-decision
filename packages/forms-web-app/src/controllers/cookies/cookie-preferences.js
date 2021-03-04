const { VIEW } = require('../../lib/views');

exports.getCookiePreferences = (req, res) => {
  res.render(VIEW.COOKIES.COOKIE_PREFERENCES);
};

exports.postCookiePreferences = async (req, res) => {
  // const { body, errors = {}, errorSummary = [] } = body;

  res.render(VIEW.COOKIES.COOKIE_PREFERENCES);
};
