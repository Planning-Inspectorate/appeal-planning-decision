const { VIEW } = require('../../lib/views');

exports.getYourPlanningAppeal = async (req, res, next) => {
  const { appeal, appealLPD } = req.session;
  const appealEmail = appeal.aboutYouSection.yourDetails.email;
  const userEmail = req?.user?._json.preferred_username;

  if (!appeal || !appealLPD) return next();

  if (!userEmail) return res.redirect(`/authenticate?email=${appealEmail}`);

  if (appealEmail.toLowerCase() === userEmail.toLowerCase()) {
    return res.render(VIEW.YOUR_PLANNING_APPEAL.INDEX, {
      appeal,
      lpd: appealLPD,
    });
  }

  return next(); // 404 if you arent authorised to see this ... could next(error) if we eant different outcome
};
