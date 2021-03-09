const getBaseUrl = require('./get-base-url');

module.exports = (req) => {
  const referer = req.get('Referer');
  const baseUrl = getBaseUrl(req);

  if (!referer || !baseUrl) {
    return '/';
  }

  if (!referer.startsWith(baseUrl)) {
    return '/';
  }

  return referer.replace(baseUrl, '');
};
