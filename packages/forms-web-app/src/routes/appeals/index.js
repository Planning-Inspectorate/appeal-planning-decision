const express = require('express');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals/index');
const selectedAppealRouter = require('./selected-appeal/selected-appeal');

router.use('/your-appeals', yourAppealsRouter);
router.use('/', selectedAppealRouter);

module.exports = router;
