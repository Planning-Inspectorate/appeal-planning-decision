const { body } = require('express-validator');

const validCostsOptions = ['yes', 'no'];

const ruleCosts = () =>
  body('claim-costs')
    .notEmpty()
    .withMessage('Select yes if you are claiming for costs as part of your appeal')
    .bail()
    .isIn(validCostsOptions);

const rules = () => {
  return [ruleCosts()];
};

module.exports = {
  rules,
  validCostsOptions,
};
