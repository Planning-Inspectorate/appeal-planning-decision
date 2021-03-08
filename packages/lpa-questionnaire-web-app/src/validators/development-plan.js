const { body } = require('express-validator');

const rules = () => {
  const developmentPlanRef = 'has-plan-submitted';
  const developmentPlanValues = ['yes', 'no'];
  const developmentPlanTextRef = 'plan-changes-text';

  return [
    body(developmentPlanRef)
      .notEmpty()
      .withMessage('Select yes if there is a relevant Development Plan or Neighbourhood Plan')
      .bail()
      .isIn(developmentPlanValues),
    body(developmentPlanTextRef)
      .if(body(developmentPlanRef).equals('yes'))
      .notEmpty()
      .withMessage('Enter the relevant information about the plans and this appeal'),
  ];
};

module.exports = {
  rules,
};
