const express = require('express');

const router = express.Router();
const homeRouter = require('./questionnaire-web-app');
const debugRouter = require('./debug');

router.use('/', homeRouter);



router.use('/debug', debugRouter);

module.exports = router;
