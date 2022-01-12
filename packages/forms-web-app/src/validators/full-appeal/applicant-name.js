const { body } = require('express-validator');

const rules = () => {
  return [
    body('behalf-appellant-name')
      .notEmpty()
      .withMessage('Enter the Applicant’s name')
      .bail()
      .matches(/^[a-z\-' ]+$/i)
      .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
      .bail()
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be between 2 and 80 characters'),
  ];
};

module.exports = {
  rules,
};
