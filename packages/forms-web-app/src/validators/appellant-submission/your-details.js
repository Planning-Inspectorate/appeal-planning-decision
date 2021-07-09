const { body } = require('express-validator');

const ruleYourName = () =>
  body('appellant-name')
    .notEmpty()
    .withMessage('Enter your name')
    .bail()
    .matches(/^[a-z\-' ]+$/i)
    .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
    .bail()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters');

function validateEmail(email) {
  const pattern = /.+@[^.]*(.*)/;

  const result = pattern.exec(email);

  /* istanbul ignore else */
  if (result && result.length > 1 && result[1].length > 2) {
    return email;
  }

  /* istanbul ignore next */
  throw new Error('Email should be a valid email address');
}

const ruleYourEmail = () =>
  body('appellant-email')
    .notEmpty()
    .withMessage('Enter an email address in the correct format, like name@example.com')
    .bail()
    .isEmail()
    .withMessage('Email should be a valid email address')
    .bail()
    .matches(/^(?=[\w\s])\s*[-+.'\w]*['\w]+@[-.\w]+\.[-.\w]+\s*$/)
    .withMessage('Email should be a valid email address')
    .bail()
    .custom((email) => validateEmail(email));

const rules = () => {
  return [ruleYourName(), ruleYourEmail()];
};

module.exports = {
  rules,
};
