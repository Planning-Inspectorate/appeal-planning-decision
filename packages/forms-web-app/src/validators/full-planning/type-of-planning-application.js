const { body } = require('express-validator');
const {
  constants: { TYPE_OF_PLANNING_APPLICATION },
} = require('@pins/business-rules');

const rules = () => {
  return [
    body('type-of-planning-application')
      .notEmpty()
      .withMessage(
        'Select which type of planning application your appeal is about, or if you have not made a planning application'
      )
      .bail()
      .isIn(Object.values(TYPE_OF_PLANNING_APPLICATION))
      .withMessage(
        'Select which type of planning application your appeal is about, or if you have not made a planning application'
      ),
  ];
};

module.exports = {
  rules,
};
