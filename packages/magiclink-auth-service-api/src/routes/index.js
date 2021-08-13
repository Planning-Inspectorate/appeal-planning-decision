const express = require('express');
const magicLinkRouter = require('./magiclink');

const router = express.Router();

router.use(magicLinkRouter);

module.exports = router;
