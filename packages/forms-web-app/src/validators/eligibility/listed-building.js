const { body } = require('express-validator');

const validIsListedBuildingOptions = ['yes', 'no'];

const rules = () => [
  body('is-your-appeal-about-a-listed-building')
    .notEmpty()
    .withMessage('Select yes if your appeal is about a listed building')
    .bail()
    .isIn(validIsListedBuildingOptions),
];

module.exports = {
  rules,
  validIsListedBuildingOptions,
};
