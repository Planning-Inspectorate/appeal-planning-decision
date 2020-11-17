const express = require('express');

const router = express.Router();

const groundsOfAppealsStatementRouter = require('./grounds-appeal');

router.use(groundsOfAppealsStatementRouter);

module.exports = router;
