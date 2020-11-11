const express = require('express');

const appealStatementController = require('../controllers/appeal-statement');
const eligibilityController = require('../controllers/eligibility');
const listedBuildingController = require('../controllers/listed-building');
const { validator } = require('./validators/validator');
const { rules: decisionDateValidationRules } = require('./validators/decision-date');
const { rules: listedBuildingValidationRules } = require('./validators/listed-building');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', eligibilityController.getNoDecision);

/* GET eligibility decision date input page. */
router.get('/decision-date', eligibilityController.getDecisionDate);

router.post(
  '/decision-date',
  decisionDateValidationRules(),
  validator,
  eligibilityController.postDecisionDate
);

/* GET eligibility decision date out page. */
router.get('/decision-date-expired', eligibilityController.getDecisionDateExpired);

/* GET eligibility planning department page. */
router.get('/planning-department', eligibilityController.getPlanningDepartment);

router.get('/listed-out', listedBuildingController.getServiceNotAvailableForListedBuildings);
router.get('/listed-building', listedBuildingController.getListedBuilding);
router.post(
  '/listed-building',
  listedBuildingValidationRules(),
  validator,
  listedBuildingController.postListedBuilding
);

router.get('/appeal-statement', appealStatementController.getAppealStatement);
router.post('/appeal-statement', appealStatementController.postAppealStatement);

module.exports = router;
