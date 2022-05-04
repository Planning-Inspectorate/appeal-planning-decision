const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');
const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');
const canUseService = require('./can-use-service');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);
router.use(useExistingServiceListedBuilding);
router.use(canUseService);

module.exports = router;
