const express = require('express');

const uploadDecisionController = require('../../controllers/appellant-submission/upload-decision');

const router = express.Router();

router.get('/upload-decision', uploadDecisionController.getUploadDecision);

module.exports = router;
