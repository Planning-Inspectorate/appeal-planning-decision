const express = require('express');

const router = express.Router();

const enterAppealDetails = require('./enter-appeal-details');
const applicationSaved = require('./application-saved');
const linkExpired = require('./link-expired');

router.use(enterAppealDetails);
router.use(applicationSaved);
router.use(linkExpired);

module.exports = router;
