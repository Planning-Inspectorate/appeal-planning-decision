const { body } = require('express-validator');

const ruleYourName = () =>
  body('appellant-name')
    .notEmpty()
    .withMessage('Enter your name')
    .bail()
    .matches(/^[a-z\-' ]+$/i)
    .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
    .bail()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters');

const ruleYourEmail = () =>
  body('appellant-email')
    .notEmpty()
    .withMessage('Enter your email address')
    .bail()
    .isEmail()
    .withMessage('Email should be a valid email address');

const rules = () => {
  return [ruleYourName(), ruleYourEmail()];
};

module.exports = {
  rules,
};
