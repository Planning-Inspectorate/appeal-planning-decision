const express = require('express');

const router = express.Router();
const {
  getPlanningObligationDeadline,
  postPlanningObligationDeadline,
} = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-deadline');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

router.get('/submit-appeal/planning-obligation-deadline', getPlanningObligationDeadline);

router.post(
  '/submit-appeal/planning-obligation-deadline',
  validationErrorHandler,
  postPlanningObligationDeadline
);

module.exports = router;
