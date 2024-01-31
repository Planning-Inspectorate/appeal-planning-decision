const express = require('express');
const serviceUnavailableRouter = require('./service-unavailable');
const firewallErrorRouter = require('./firewall-error');

const router = express.Router();

router.use(serviceUnavailableRouter);
router.use(firewallErrorRouter);

module.exports = router;
