const config = require('../config');

const defaultOptions = {
  fallbackPath: config.appeals.startingPoint,
  stackSize: 255,
};

module.exports =
  (options = defaultOptions) =>
  (req, res, next) => {
    const activeOptions = {
      ...defaultOptions,
      ...options,
    };

    if (!req.session) {
      next();
      return;
    }

    if (!req.session.navigationHistory || !Array.isArray(req.session.navigationHistory)) {
      req.session.navigationHistory = [activeOptions.fallbackPath];
    }

    const currentPage = req.baseUrl + req.path;

    // going forwards
    if (currentPage === req.session.navigationHistory[0]) {
      if (req.session.navigationHistory.length > 1) {
        req.session.navigationHistory = [
          currentPage,
          ...req.session.navigationHistory.slice(1, activeOptions.stackSize - 1),
        ];
      }

      next();
      return;
    }

    // going backwards
    if (currentPage === req.session.navigationHistory[1]) {
      req.session.navigationHistory = req.session.navigationHistory.slice(1);

      next();
      return;
    }

    req.session.navigationHistory = [
      currentPage,
      ...req.session.navigationHistory.slice(0, activeOptions.stackSize - 1),
    ];

    next();
  };
