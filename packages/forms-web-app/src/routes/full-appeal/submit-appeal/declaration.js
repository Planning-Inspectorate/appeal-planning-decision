const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const declarationController = require('../../../controllers/full-appeal/submit-appeal/declaration');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/submit-appeal/declaration',
  [fetchExistingAppealMiddleware],
  declarationController.getDeclaration
);
router.post(
  '/submit-appeal/declaration',
  validationErrorHandler,
  declarationController.postDeclaration
);

module.exports = router;
