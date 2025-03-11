const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');
const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');
const canUseService = require('./can-use-service');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const useExistingServiceApplicationType = require('./use-existing-service-application-type');
const enforcementNotice = require('./enforcement-notice');
const useExistingServiceEnforcementNotice = require('./use-existing-service-enforcement-notice');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);
router.use(useExistingServiceListedBuilding);
router.use(canUseService);
router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use(useExistingServiceApplicationType);
router.use(enforcementNotice);
router.use(useExistingServiceEnforcementNotice);

module.exports = router;
