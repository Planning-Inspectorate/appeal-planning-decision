const express = require('express');
const uploadPlansController = require('../controllers/upload-plans');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');

const router = express.Router();

router.get(
  '/:id/plans',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, clearUploadedFilesMiddleware],
  uploadPlansController.getUploadPlans
);

module.exports = router;
