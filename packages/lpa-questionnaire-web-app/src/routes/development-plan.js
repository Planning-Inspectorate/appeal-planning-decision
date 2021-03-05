const express = require('express');
const developmentPlanController = require('../controllers/development-plan');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.get(
  '/:id/development-plan',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  developmentPlanController.getDevelopmentPlan
);

module.exports = router;
