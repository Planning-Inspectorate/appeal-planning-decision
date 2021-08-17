const express = require('express');
const authenticationController = require('../../controllers/authentication');
const fetchLPA = require('../../middleware/fetch-lpa');

const router = express.Router();

router.get(
  '/:lpaCode/authentication/your-email/:error(session-expired|link-expired)?',
  fetchLPA,
  authenticationController.showEnterEmailAddress
);
router.post(
  '/:lpaCode/authentication/your-email',
  fetchLPA,
  authenticationController.processEmailAddress
);
router.get(
  '/:lpaCode/authentication/confirm-email',
  fetchLPA,
  authenticationController.showEmailConfirmation
);

module.exports = router;
