const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');
const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');
const canUseService = require('./can-use-service');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const useADifferentServiceRouter = require('../before-you-start/use-a-different-service');
const useExistingServiceApplicationType = require('./use-existing-service-application-type');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);
router.use(useExistingServiceListedBuilding);
router.use(canUseService);
router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use(useADifferentServiceRouter);
router.use(useExistingServiceApplicationType);

module.exports = router;
