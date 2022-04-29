const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');
const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);
router.use(useExistingServiceListedBuilding);

module.exports = router;
