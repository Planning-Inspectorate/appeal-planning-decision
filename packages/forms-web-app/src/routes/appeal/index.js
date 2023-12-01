const express = require('express');

const router = express.Router();

const newSavedAppealRouter = require('./new-saved-appeal');
const emailAddressRouter = require('./email-address');

router.use(newSavedAppealRouter);
router.use(emailAddressRouter);

module.exports = router;
