const { getDepartmentFromId } = require('../services/department.service');
const logger = require('../lib/logger');

module.exports = async (req, res, next) => {
  const { appeal } = req.session;
  delete req.session.appealLPD;

  try {
    if (appeal && appeal.lpaCode) req.session.appealLPD = await getDepartmentFromId(appeal.lpaCode);
  } catch (e) {
    logger.error(e);
  }

  return next();
};
