const express = require('express');
const useExistingServiceEnforcementNotice = require('../../controllers/before-you-start/use-existing-service-enforcement-notice');

const router = express.Router();

router.get(
	'/use-existing-service-enforcement-notice',
	useExistingServiceEnforcementNotice.getUseExistingServiceEnforcementNotice
);

module.exports = router;
