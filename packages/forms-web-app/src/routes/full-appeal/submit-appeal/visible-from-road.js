const express = require('express');
const {
  getVisibleFromRoad,
  postVisibleFromRoad,
} = require('../../../controllers/full-appeal/submit-appeal/visible-from-road');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');
const {
  rules: conditionalTextValidationRules,
} = require('../../../validators/common/conditional-text');

const router = express.Router();

router.get('/submit-appeal/visible-from-road', [fetchExistingAppealMiddleware], getVisibleFromRoad);
router.post(
  '/submit-appeal/visible-from-road',
  optionsValidationRules({
    fieldName: 'visible-from-road',
    emptyError: 'Select yes if the site is visible from a public road',
  }),
  conditionalTextValidationRules({
    fieldName: 'visible-from-road-details',
    targetFieldName: 'visible-from-road',
    emptyError: 'Tell us how visibility is restricted',
    tooLongError: 'How visibility is restricted must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postVisibleFromRoad
);

module.exports = router;
