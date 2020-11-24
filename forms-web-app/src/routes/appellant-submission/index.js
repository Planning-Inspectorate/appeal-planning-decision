const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const supportingDocumentsRouter = require('./supporting-documents');
const uploadApplicationRouter = require('./upload-application');
const uploadDecisionRouter = require('./upload-decision');

router.use(appealStatementRouter);
router.use(supportingDocumentsRouter);
router.use(uploadApplicationRouter);
router.use(uploadDecisionRouter);

module.exports = router;
