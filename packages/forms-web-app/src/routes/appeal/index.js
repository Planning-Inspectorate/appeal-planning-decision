const express = require('express');

const router = express.Router();

const newSavedAppealRouter = require('./new-saved-appeal');
const emailAddressRouter = require('./email-address');
const enterCodeRouter = require('./enter-code');
const codeExpiredRouter = require('./code-expired');
const requestNewCodeRouter = require('./request-new-code');
const needNewCodeRouter = require('./need-new-code');

router.use(newSavedAppealRouter);
router.use(emailAddressRouter);
router.use(enterCodeRouter);
router.use(codeExpiredRouter);
router.use(requestNewCodeRouter);
router.use(needNewCodeRouter);

module.exports = router;
