const url = require('url');

module.exports = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    const { query } = url.parse(req.originalUrl, true);

    if (query.useOsOutput === '1') {
      try {
        const results = JSON.parse(body).map((DPA) => ({
          DPA,
        }));

        const headers = {
          uri: req.url,
        };

        return originalSend.call(this, JSON.stringify({ headers, results }));
      } catch (err) {
        res.status(404);
        return originalSend.call(this, '{}');
      }
    }

    return originalSend.call(this, body);
  };

  next();
};
