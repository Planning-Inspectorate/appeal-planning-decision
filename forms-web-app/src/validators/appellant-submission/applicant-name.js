const { body } = require('express-validator');

const rules = () => {
  return [
    body('behalf-appellant-name')
      .notEmpty()
      .escape()
      .withMessage('Enter the name your appealing for')
      .bail()
      .matches(/^[a-z\-' ]+$/i)
      .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
      .bail()
      .isLength({ min: 2, max: 255 })
      .withMessage('Name must be between 2 and 255 characters'),
  ];
};

module.exports = {
  rules,
};
