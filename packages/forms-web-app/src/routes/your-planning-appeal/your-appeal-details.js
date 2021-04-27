const express = require('express');

const yourAppealDetailsController = require('../../controllers/your-planning-appeal/your-appeal-details');
const ensureAppealIsAvailable = require('../../middleware/ensure-appeal-is-available');
const setBackLinkFromAppeal = require('../../middleware/set-back-link-from-appeal');
const fetchAppealLpdByAppealLpaCode = require('../../middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const getYourPlanningAppealLink = require('../../lib/get-your-planning-appeal-link');

const router = express.Router();

router.get(
  '/your-appeal-details',
  [
    ensureAppealIsAvailable,
    fetchAppealLpdByAppealLpaCode,
    setBackLinkFromAppeal(getYourPlanningAppealLink),
  ],
  yourAppealDetailsController.getYourAppealDetails
);

module.exports = router;
