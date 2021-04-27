const navigationHistoryMiddleware = require('./navigation-history');

module.exports = (backLinkFn) => (req, res, next) => {
  /**
   * This should never happen. Navigation History is a top level middleware. However, if this were to happen, we will
   * fall back to a default backlink.
   */
  if (!req.session?.navigationHistory) {
    next();
    return;
  }

  /**
   * This is not particularly robust. However, we currently do not guarantee the appeal object has a valid shape.a
   */
  if (!req.session?.appeal?.id) {
    next();
    return;
  }

  navigationHistoryMiddleware({
    fallbackPath: backLinkFn(req.session.appeal),
  })(req, res, next);
};
