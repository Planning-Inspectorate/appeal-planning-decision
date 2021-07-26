const { body } = require('express-validator');

const rules = () => {
  const healthSafetyRef = 'has-health-safety';
  const healthSafetyValues = ['yes', 'no'];
  const healthSafetyTextRef = 'health-safety-text';

  return [
    body(healthSafetyRef)
      .notEmpty()
      .withMessage('Select yes if there are health and safety issues')
      .bail()
      .isIn(healthSafetyValues),
    body(healthSafetyTextRef)
      .if(body(healthSafetyRef).equals('yes'))
      .notEmpty()
      .withMessage('Enter the health and safety issues'),
  ];
};

module.exports = {
  rules,
};
