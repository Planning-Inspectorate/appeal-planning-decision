const { body } = require('express-validator');

const validCertificateIncludedOptions = ['yes', 'no'];

const ruleIncludedCertificates = () =>
  body('do-you-have-certificates')
    .notEmpty()
    .withMessage('Select your site ownership and agricultural holdings certificate')
    .bail()
    .isIn(validCertificateIncludedOptions);

const rules = () => [ruleIncludedCertificates()];

module.exports = {
  rules,
  validCertificateIncludedOptions,
};
