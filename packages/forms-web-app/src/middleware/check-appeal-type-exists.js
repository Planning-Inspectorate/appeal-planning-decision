const { featureFlag } = require('../config');
const logger = require('../lib/logger');

const checkAppealTypeExists = (req, res, next) => {
  const { session: { appeal, appeal: { appealType } = {} } = {} } = req;

  logger.debug({ appeal }, 'Appeal data in checkAppealTypeExists');
  logger.debug({ featureFlag }, 'Feature flag in checkAppealTypeExists');

  const allowList = [
    '/before-you-start/local-planning-depart',
    '/before-you-start/type-of-planning-application',
    '/before-you-start/use-a-different-service',
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
