const express = require('express');
const fetchAppealByUrlParam = require('../../middleware/fetch-appeal-by-url-param');
const fetchAppealLpdByAppealLpaCode = require('../../middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const yourPlanningAppealController = require('../../controllers/your-planning-appeal');
const yourAppealDetailsRouter = require('./your-appeal-details');

const router = express.Router();

router.use(yourAppealDetailsRouter);
router.get(
  '/:appealId',
  [fetchAppealByUrlParam('appealId'), fetchAppealLpdByAppealLpaCode],
  yourPlanningAppealController.getYourPlanningAppeal
);

module.exports = router;
