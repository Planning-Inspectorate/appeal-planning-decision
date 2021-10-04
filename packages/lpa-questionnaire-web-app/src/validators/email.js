const { body } = require('express-validator');

const ruleYourEmail = () => 
  body('email')
    .notEmpty()
    .withMessage('Enter an email address in the correct format, like name@example.com')
    .bail()
    .isEmail()
    .withMessage('Enter an email address in the correct format, like name@example.com')
    .bail()
    .matches(/^(?=[\w\s])\s*[-+.'\w]*['\w]+@[-.\w]+\.[-.\w]+\s*$/)
    .withMessage('Enter an email address in the correct format, like name@example.com');

const rules = () => [ruleYourEmail()];

module.exports = {
  rules,
};