const logger = require('../lib/logger');

module.exports = (req, res, next) => {
  const { appeal } = res.locals;

  if (!appeal) {
    delete req.session.appeal;
    return next();
  }

  try {
    logger.debug({ id: appeal.id }, `Get existing appeal from res.locals`);
    req.session.appeal = appeal;
  } catch (err) {
    logger.debug({ err }, `Error retrieving appeal using res.locals`);
    delete req.session.appeal;
  }

  return next();
};
