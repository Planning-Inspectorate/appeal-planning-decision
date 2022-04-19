const { featureFlag } = require('../config');
const logger = require('../lib/logger');

const checkAppealTypeExists = (req, res, next) => {
  const { session: { appeal } = {} } = req;

  logger.debug({ appeal }, 'Appeal data in checkAppealTypeExists');
  logger.debug({ featureFlag }, 'Feature flag in checkAppealTypeExists');

  const allowList = [
    '/before-you-start/local-planning-depart',
    '/before-you-start/type-of-planning-application',
    '/before-you-start/use-a-different-service',
    '/before-you-start/use-existing-service-application-type',
    '/before-you-start/use-existing-service-local-planning-department',
    '/appellant-submission/submission-information',
    '/full-appeal/submit-appeal/declaration-information',
  ];

  if (!featureFlag.newAppealJourney) {
    return next();
  }

  const isInAllowList = allowList.some((path) => req.originalUrl.includes(path));

  if (isInAllowList) {
    return next();
  }

  if (appeal && appeal.appealType) {
    return next();
  }

  return res.redirect('/before-you-start/local-planning-depart');
};

module.exports = checkAppealTypeExists;
