const { body } = require('express-validator');
const { FORM_FIELD } = require('../../controllers/appellant-submission/who-are-you');

const rules = () => {
  const areYouTheOriginalAppellant = 'original-application-your-name';

  const areYouTheOriginalAppellantPossibleValues = FORM_FIELD[
    areYouTheOriginalAppellant
  ].items.reduce((acc, item) => [...acc, item.value], []);

  return [
    body(areYouTheOriginalAppellant)
      .escape()
      .notEmpty()
      .withMessage('Select yes if the original planning application was made in your name')
      .bail()
      .isIn(areYouTheOriginalAppellantPossibleValues),
  ];
};

module.exports = {
  rules,
};
