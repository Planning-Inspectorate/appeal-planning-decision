const { featureFlag } = require('../config');

const checkAppealTypeExists = (req, res, next) => {
  const { session: { appeal: { appealType } = {} } = {} } = req;
  const allowList = [
    '/before-you-start/local-planning-depart',
    '/before-you-start/type-of-planning-application',
  ];

  if (!featureFlag.newAppealJourney) {
    return next();
  }

  if (allowList.includes(req.originalUrl)) {
    return next();
  }

  if (appealType) {
    return next();
  }

  return res.redirect('/before-you-start/local-planning-depart');
};

module.exports = checkAppealTypeExists;
