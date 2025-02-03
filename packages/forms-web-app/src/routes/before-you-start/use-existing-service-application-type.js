const express = require('express');
const useExistingServiceApplicationType = require('../../controllers/before-you-start/use-existing-service-application-type');
const router = express.Router();

router.get(
	'/use-existing-service-application-type',
	useExistingServiceApplicationType.getUseExistingServiceApplicationType
);

module.exports = router;
