const express = require('express');

const router = express.Router();
const planningObligationDeadlineController = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-deadline');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligationDeadline';

router.get(
  '/submit-appeal/planning-obligation-deadline',
  planningObligationDeadlineController.getPlanningObligationDeadline
);

router.post(
  '/submit-appeal/planning-obligation-deadline',
  setSectionAndTaskNames(sectionName, taskName),
  validationErrorHandler,
  planningObligationDeadlineController.postPlanningObligationDeadline
);

module.exports = router;
