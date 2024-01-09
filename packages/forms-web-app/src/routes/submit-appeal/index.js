const express = require('express');

const router = express.Router();

const enterAppealDetails = require('./enter-appeal-details');
const applicationSaved = require('./application-saved');

router.use(enterAppealDetails); // is this used anywhere?
router.use(applicationSaved);

module.exports = router;
