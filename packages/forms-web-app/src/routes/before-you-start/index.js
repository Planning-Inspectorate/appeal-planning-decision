const express = require('express');

const router = express.Router();

const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');

router.use(useExistingServiceListedBuilding);

module.exports = router;
