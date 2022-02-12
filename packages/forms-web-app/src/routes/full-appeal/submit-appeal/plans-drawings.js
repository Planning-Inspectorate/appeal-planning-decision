const express = require('express');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../controllers/full-appeal/submit-appeal/plans-drawings');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/plans-drawings', [fetchExistingAppealMiddleware], getPlansDrawings);
router.post(
  '/submit-appeal/plans-drawings',
  optionsValidationRules({
    fieldName: 'plans-drawings',
    emptyError: 'Select yes if you want to submit any new plans and drawings with your appeal',
  }),
  validationErrorHandler,
  postPlansDrawings
);

module.exports = router;
