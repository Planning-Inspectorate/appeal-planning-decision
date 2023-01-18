const express = require('express');
const serviceUnavailableRouter = require('./service-unavailable');

const router = express.Router();

router.use(serviceUnavailableRouter);

module.exports = router;
