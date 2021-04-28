const logger = require('../lib/logger');
const { VIEW } = require('../lib/views');
const { getDepartmentFromId } = require('../services/department.service');
const appealModel = require('../models/appealModel');

exports.getYourPlanningAppeal = async (req, res, next) => {
  const { appealId } = req.params;
  let appeal;
  let lpd;

  try {
    appeal = await appealModel.getAppeal(appealId);
    lpd = await getDepartmentFromId(appeal.lpaCode);
  } catch (error) {
    if (error.response.status === 404) return next();

    logger.error(error);
    return next(error);
  }

  res.render(VIEW.YOUR_PLANNING_APPEAL, {
    appeal,
    lpd,
  });
};
