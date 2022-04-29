const express = require('express');
const useExistingServiceListedBuilding = require('../../controllers/before-you-start/use-existing-service-listed-building');

const router = express.Router();

router.get(
  '/use-existing-service-listed-building',
  useExistingServiceListedBuilding.getUseExistingServiceListedBuilding
);

module.exports = router;
