const express = require('express');

const router = express.Router();
const passport = require('passport');

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');

router.all('*', (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  const userName = req?.user?._json.preferred_username;
  if (userName) res.locals.userName = userName;
  return next();
});

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/appellant-submission', checkDecisionDateDeadline, appellantSubmissionRouter);
router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);

router.all(
  '/authenticate',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    if (req.user) return res.redirect('/logged-in');

    return res.redirect('https://login.microsoftonline.com/');
  },

  (req, res) => {
    res.render('check-your-inbox', { token: JSON.stringify(req) });
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/logged-in', (req, res) => {
  res.render('logged-in');
});

router.post(
  '/token',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    const dest = req.session.postLoginDestination;
    if (dest) {
      delete req.session.postLoginDestination;
      res.redirect(req.session.postLoginDestination);
    }
    res.redirect('/logged-in');
  }
);

module.exports = router;
