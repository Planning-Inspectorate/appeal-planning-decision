const express = require('express');
const emailConfirmedRouter = require('./email-address-confirmed');
const cannotAppealRouter = require('./cannot-appeal');

const router = express.Router();

router.use(emailConfirmedRouter);
router.use(cannotAppealRouter);

module.exports = router;
