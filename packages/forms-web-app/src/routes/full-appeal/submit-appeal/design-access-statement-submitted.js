const express = require('express');
const {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
} = require('../../../controllers/full-appeal/submit-appeal/design-access-statement-submitted');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: yesNoValidationRules } = require('../../../validators/common/yes-no');

const router = express.Router();

router.get(
  '/submit-appeal/design-access-statement-submitted',
  [fetchExistingAppealMiddleware],
  getDesignAccessStatementSubmitted
);
router.post(
  '/submit-appeal/design-access-statement-submitted',
  yesNoValidationRules(
    'design-access-statement-submitted',
    'Select yes if you submitted a design and access statement with your application'
  ),
  validationErrorHandler,
  postDesignAccessStatementSubmitted
);

module.exports = router;
