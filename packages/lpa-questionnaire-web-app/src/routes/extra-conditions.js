const express = require('express');
const extraConditionsController = require('../controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.get(
  '/:id/extra-conditions',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  extraConditionsController.getExtraConditions
);

module.exports = router;
