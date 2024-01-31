const express = require('express');
const firewallErrorController = require('../../controllers/error/firewall-error');

const router = express.Router();

router.get('/firewall-error', firewallErrorController.getFirewallError);

module.exports = router;
