const express = require('express');
const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.get(
  '/:id/authentication/your-email/:error(session-expired|link-expired)?',
  authenticationController.showEnterEmailAddress
);
router.post('/:id/authentication/your-email', authenticationController.processEmailAddress);
router.get('/:id/authentication/confirm-email', authenticationController.showEmailConfirmation);

module.exports = router;
