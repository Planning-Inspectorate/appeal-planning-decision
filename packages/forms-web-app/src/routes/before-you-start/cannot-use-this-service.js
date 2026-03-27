const express = require('express');
const useExistingServiceApplicationType = require('../../controllers/before-you-start/cannot-use-service');
const router = express.Router();

router.get('/cannot-use-this-service', useExistingServiceApplicationType.getCannotUseThisService);

module.exports = router;
