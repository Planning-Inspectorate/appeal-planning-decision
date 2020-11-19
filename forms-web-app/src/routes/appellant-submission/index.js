const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const supportingDocumentsRouter = require('./supporting-documents');

router.use(appealStatementRouter);
router.use(supportingDocumentsRouter);

module.exports = router;
