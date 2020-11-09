const { body, validationResult } = require('express-validator');
const {
  expressValidationErrorsToGovUkErrorList,
} = require('../../lib/express-validation-errors-to-govuk-error-list');
const { FORM_FIELD } = require('../../controllers/listed-building');

const rules = () => {
  const isYourAppealAListedBuildingId = 'is-your-appeal-about-a-listed-building';

  const isYourAppealAListedBuildingPossibleValues = FORM_FIELD[
    isYourAppealAListedBuildingId
  ].items.reduce((acc, item) => [...acc, item.value], []);

  return [
    body(isYourAppealAListedBuildingId)
      .notEmpty()
      .withMessage('You need to select a response')
      .bail()
      .isIn(isYourAppealAListedBuildingPossibleValues),
  ];
};

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const mappedErrors = errors.mapped();

  req.body.errors = mappedErrors;
  req.body.errorSummary = expressValidationErrorsToGovUkErrorList(mappedErrors);

  return next();
};

module.exports = {
  rules,
  validator,
};
