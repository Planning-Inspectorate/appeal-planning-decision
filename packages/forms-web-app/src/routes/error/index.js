const express = require('express');
const serviceUnavailableRouter = require('./service-unavailable');
const firewallErrorRouter = require('./firewall-error');
const problemWithService = require('./problem-with-service');
const config = require('../../config');

const router = express.Router();

router.use(serviceUnavailableRouter);
router.use(firewallErrorRouter);

/// Render Error Pages for test purposes ///
if (!config.isProduction) {
	router.use(problemWithService);
}

module.exports = router;
