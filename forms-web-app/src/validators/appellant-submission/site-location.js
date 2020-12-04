const { body } = require('express-validator');

const ruleAddressLine1 = () =>
  body('site-address-line-one')
    .escape()
    .notEmpty()
    .withMessage('Enter a building and/or street')
    .bail()
    .isLength({ min: 1, max: 60 })
    .bail()
    .withMessage('Building and/or street must be 60 characters or fewer');

const ruleAddressLine2 = () =>
  body('site-address-line-two')
    .escape()
    .isLength({ min: 0, max: 60 })
    .bail()
    .withMessage('Building and/or street must be 60 characters or fewer');

const ruleAddressTownCity = () =>
  body('site-town-city')
    .escape()
    .isLength({ min: 0, max: 60 })
    .bail()
    .withMessage('Town or city must be 60 characters or fewer');

const ruleAddressCounty = () =>
  body('site-county')
    .escape()
    .notEmpty()
    .withMessage('Enter a county')
    .bail()
    .isLength({ min: 1, max: 60 })
    .bail()
    .withMessage('County must be 60 characters or fewer');

const ruleAddressPostCode = () =>
  body('site-postcode')
    .escape()
    .notEmpty()
    .withMessage('Enter a postcode')
    .bail()
    .isLength({ min: 1, max: 8 })
    .bail()
    .withMessage('Postcode must be 8 characters or fewer');

const rules = () => {
  return [
    ruleAddressLine1(),
    ruleAddressLine2(),
    ruleAddressTownCity(),
    ruleAddressCounty(),
    ruleAddressPostCode(),
  ];
};

module.exports = {
  rules,
};
