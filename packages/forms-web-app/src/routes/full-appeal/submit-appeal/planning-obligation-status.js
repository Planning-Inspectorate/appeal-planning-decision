const express = require('express');
const router = express.Router();

const planningObligationStatusController = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-status');

router.get(
  '/submit-appeal/planning-obligation-status',
  planningObligationStatusController.getPlanningObligationStatus
);

module.exports = router;
