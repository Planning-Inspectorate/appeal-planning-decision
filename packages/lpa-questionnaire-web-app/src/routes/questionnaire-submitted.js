const express = require('express');
const questionnaireSubmittedController = require('../controllers/questionnaire-submitted');

const router = express.Router();

router.get(
  '/:id/questionnaire-submitted',
  questionnaireSubmittedController.getQuestionnaireSubmitted
);

module.exports = router;
