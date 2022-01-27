const express = require('express');

const appealSubmittedController = require('../../../controllers/full-appeal/submit-appeal/appeal-submitted');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get(
  '/submit-appeal/appeal-submitted',
  [fetchExistingAppealMiddleware],
  appealSubmittedController.getAppealSubmitted
);

module.exports = router;
