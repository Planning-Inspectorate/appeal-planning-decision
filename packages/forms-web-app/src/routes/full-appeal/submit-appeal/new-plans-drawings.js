const express = require('express');
const {
  getNewPlansDrawings,
  postNewPlansDrawings,
} = require('../../../controllers/full-appeal/submit-appeal/new-plans-drawings');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/submit-appeal/new-plans-drawings',
  [fetchExistingAppealMiddleware],
  getNewPlansDrawings
);

router.post(
  '/submit-appeal/new-plans-drawings',
  optionsValidationRules({
    fieldName: 'plans-drawings',
    emptyError: 'Select yes if you want to submit any new plans and drawings with your appeal',
  }),
  validationErrorHandler,
  postNewPlansDrawings
);

module.exports = router;
