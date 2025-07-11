const express = require('express');

const router = express.Router();

const beforeYouStart = require('./before-you-start');
const useExistingServiceDevelopmentType = require('./use-existing-service-development-type');
const useExistingServiceListedBuilding = require('./use-existing-service-listed-building');
const canUseService = require('./can-use-service');
const localPlanningAuthorityRouter = require('./local-planning-authority');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const planningApplicationAbout = require('./planning-application-about');
const useExistingServiceApplicationType = require('./use-existing-service-application-type');
const enforcementNotice = require('./enforcement-notice');
const useExistingServiceEnforcementNotice = require('./use-existing-service-enforcement-notice');
const clearAppealSession = require('./clear-appeal-session');

router.use(beforeYouStart);
router.use(useExistingServiceDevelopmentType);
router.use(useExistingServiceListedBuilding);
router.use(canUseService);
router.use(localPlanningAuthorityRouter);
router.use(typeOfPlanningApplicationRouter);
router.use(planningApplicationAbout);
router.use(useExistingServiceApplicationType);
router.use(enforcementNotice);
router.use(useExistingServiceEnforcementNotice);
router.use(clearAppealSession);

module.exports = router;
