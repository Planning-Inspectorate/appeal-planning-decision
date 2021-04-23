const { VIEW } = require('../../lib/views');

exports.getYourPlanningAppeal = async (req, res, next) => {
  const { appeal, appealLPD } = req.session;

  if (!appeal || !appealLPD) return next();

  return res.render(VIEW.YOUR_PLANNING_APPEAL, {
    appeal,
    lpd: appealLPD,
  });
};
