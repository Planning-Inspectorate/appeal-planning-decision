const { body } = require('express-validator');

const rules = () => {
  return [
    body('behalf-appellant-name')
      .notEmpty()
      .withMessage('Enter the name you are appealing for')
      .bail()
      .matches(/^[a-z\-' ]+$/i)
      .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
      .bail()
      .isLength({ min: 2, max: 80 })
      .withMessage('Your name must be no fewer than 2 characters and no more than 80 characters'),
  ];
};

module.exports = {
  rules,
};
