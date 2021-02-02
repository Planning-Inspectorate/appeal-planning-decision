const express = require('express');
const areaAppealsController = require('../controllers/area-appeals');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: applicantNameValidationRules } = require('../validators/area-appeals');

const router = express.Router();

router.get('/area-appeals', areaAppealsController.getAreaAppeals);
router.post(
  '/area-appeals',
  applicantNameValidationRules(),
  validationErrorHandler,
  areaAppealsController.postAreaAppeals
);
module.exports = router;
