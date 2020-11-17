const express = require('express');

const router = express.Router();

const groundsOfAppealStatementRouter = require('./appeal-statement');

router.use(groundsOfAppealStatementRouter);

module.exports = router;
