const express = require('express');
const magicLinkRouter = require('./magiclink');
const apiDocsRouter = require('./api-docs');
const router = express.Router();

router.use(apiDocsRouter);
router.use(magicLinkRouter);

module.exports = router;
