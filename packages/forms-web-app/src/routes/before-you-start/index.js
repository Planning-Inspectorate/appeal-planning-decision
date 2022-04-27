const express = require('express');

const router = express.Router();

const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');

router.use(useExistingServiceDevelopmentType);

module.exports = router;
