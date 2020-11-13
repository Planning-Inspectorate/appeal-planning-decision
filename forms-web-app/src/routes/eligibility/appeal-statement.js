const express = require('express');

const appealStatementController = require('../../controllers/eligibility/appeal-statement');

const router = express.Router();

router.get('/appeal-statement', appealStatementController.getAppealStatement);
router.post('/appeal-statement', appealStatementController.postAppealStatement);

module.exports = router;
