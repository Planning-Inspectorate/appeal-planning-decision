const express = require('express');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals');

router.use(yourAppealsRouter);

module.exports = router;
