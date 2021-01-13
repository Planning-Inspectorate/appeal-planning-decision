const { body } = require('express-validator');
const { FORM_FIELD } = require('../../controllers/appellant-submission/who-are-you');

const rules = () => {
  const areYouTheOriginalAppellant = 'are-you-the-original-appellant';

  const areYouTheOriginalAppellantPossibleValues = FORM_FIELD[
    areYouTheOriginalAppellant
  ].items.reduce((acc, item) => [...acc, item.value], []);

  return [
    body(areYouTheOriginalAppellant)
      .escape()
      .notEmpty()
      .withMessage('Select yes if you are the original appellant')
      .bail()
      .isIn(areYouTheOriginalAppellantPossibleValues),
  ];
};

module.exports = {
  rules,
};
