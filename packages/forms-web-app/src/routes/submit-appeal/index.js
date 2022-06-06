const express = require('express');

const router = express.Router();

const enterAppealDetails = require('./enter-appeal-details');

router.use(enterAppealDetails);

module.exports = router;
