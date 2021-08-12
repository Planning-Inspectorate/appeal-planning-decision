const express = require('express');
const authenticationRouter = require('./authentication');
const magicLinkRouter = require('./magiclink');

const router = express.Router();

router.use(authenticationRouter);
router.use(magicLinkRouter);

module.exports = router;
