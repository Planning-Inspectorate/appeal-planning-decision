const { body } = require('express-validator');

const rules = () => {
  return [
    body('type-of-planning-application')
      .notEmpty()
      .withMessage(
        'Select which type of planning application your appeal is about, or if you have not made a planning application'
      )
      .bail(),
  ];
};

module.exports = {
  rules,
};
