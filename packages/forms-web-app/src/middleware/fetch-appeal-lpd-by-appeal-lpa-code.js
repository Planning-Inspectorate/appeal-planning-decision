const { getDepartmentFromId } = require('../services/department.service');
const logger = require('../lib/logger');

module.exports = async (req, res, next) => {
  const { appeal } = res.locals;

  if (!appeal) {
    return res.sendStatus(400);
  }

  if (!appeal.lpaCode) {
    res.status(400);
    return res.render('error/400', {
      message: 'Unable to locate the LPA code for the given appeal.',
    });
  }

  try {
    res.locals.appealLPD = await getDepartmentFromId(appeal.lpaCode);
  } catch (e) {
    logger.error(e);
    delete res.locals.appealLPD;
  }

  return next();
};
