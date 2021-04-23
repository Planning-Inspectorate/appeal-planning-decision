const express = require('express');
const fetchAppealByUrlParam = require('../../middleware/fetch-appeal-by-url-param');
const fetchAppealLpdByAppealLpaCode = require('../../middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const yourPlanningAppealController = require('../../controllers/your-planning-appeal');

const router = express.Router();

router.get(
  '/:appealId',
  [fetchAppealByUrlParam('appealId'), fetchAppealLpdByAppealLpaCode],
  yourPlanningAppealController.getYourPlanningAppeal
);

module.exports = router;
