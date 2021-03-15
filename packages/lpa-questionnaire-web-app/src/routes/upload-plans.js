const express = require('express');
const uploadPlansController = require('../controllers/upload-plans');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.get(
  '/:id/plans',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  uploadPlansController.getUploadPlans
);

module.exports = router;
