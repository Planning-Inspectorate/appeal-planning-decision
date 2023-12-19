const express = require('express');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals/index');

router.use('/your-appeals', yourAppealsRouter);

module.exports = router;
