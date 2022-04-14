const express = require('express');
const useExistingServiceLocalPlanningDepartment = require('../../controllers/full-appeal/use-existing-service-local-planning-department');

const router = express.Router();

router.get(
  '/use-existing-service-local-planning-department',
  useExistingServiceLocalPlanningDepartment.getUseExistingServiceLocalPlanningDepartment
);

module.exports = router;
