const {
  constants: { PROCEDURE_TYPE },
} = require('@pins/business-rules');
const express = require('express');
const {
  getHowDecideAppeal,
  postHowDecideAppeal,
} = require('../../../controllers/full-appeal/submit-appeal/how-decide-appeal');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/how-decide-appeal', [fetchExistingAppealMiddleware], getHowDecideAppeal);
router.post(
  '/submit-appeal/how-decide-appeal',
  optionsValidationRules({
    fieldName: 'procedure-type',
    emptyError: 'Select how you would prefer us to decide your appeal',
    validOptions: Object.values(PROCEDURE_TYPE),
  }),
  validationErrorHandler,
  postHowDecideAppeal
);

module.exports = router;
