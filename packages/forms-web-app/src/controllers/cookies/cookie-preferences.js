const { VIEW } = require('../../lib/views');

exports.getCookiePreferences = (req, res) => {
  res.render(VIEW.COOKIES.COOKIE_PREFERENCES);
};
