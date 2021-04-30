const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');

exports.getYourPlanningAppeal = async (req, res, next) => {
  const { appeal, appealLPD } = res.locals;

  return res.render(VIEW.YOUR_PLANNING_APPEAL.INDEX, {
    appeal,
    lpd: appealLPD,
  });
};
