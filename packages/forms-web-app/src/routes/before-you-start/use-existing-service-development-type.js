const express = require('express');
const useExistingServiceDevelopmentType = require('../../controllers/before-you-start/use-existing-service-development-type')

const router = express.Router();

router.get('/use-existing-service-development-type', useExistingServiceDevelopmentType.getExistingServiceDevelopmentType);

module.exports = router;