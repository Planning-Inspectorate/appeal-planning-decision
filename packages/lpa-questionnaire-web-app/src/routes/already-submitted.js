const express = require('express');
const alreadySubmittedController = require('../controllers/already-submitted');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/already-submitted',
  alreadySubmittedController.getAlreadySubmitted
);

module.exports = router;