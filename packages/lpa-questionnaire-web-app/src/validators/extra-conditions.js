const { body } = require('express-validator');

const rules = () => {
  const extraConditionsRef = 'has-extra-conditions';
  const extraConditionsValues = ['yes', 'no'];
  const extraConditionsTextRef = 'extra-conditions-text';

  return [
    body(extraConditionsRef)
      .notEmpty()
      .withMessage('Select yes if you have extra conditions')
      .bail()
      .isIn(extraConditionsValues),
    body(extraConditionsTextRef)
      .if(body(extraConditionsRef).equals('yes'))
      .notEmpty()
      .withMessage('What are the extra conditions?'),
  ];
};

module.exports = {
  rules,
};
