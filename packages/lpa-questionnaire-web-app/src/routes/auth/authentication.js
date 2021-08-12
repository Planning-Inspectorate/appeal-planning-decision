const express = require('express');
const authenticationController = require('../../controllers/authentication');

const router = express.Router();

router.get(
  '/:lpaCode/authentication/your-email/:error(session-expired|link-expired)?',
  authenticationController.showEnterEmailAddress
);
router.post('/:lpaCode/authentication/your-email', authenticationController.processEmailAddress);
router.get(
  '/:lpaCode/authentication/confirm-email',
  authenticationController.showEmailConfirmation
);

module.exports = router;
