const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);

module.exports = router;
