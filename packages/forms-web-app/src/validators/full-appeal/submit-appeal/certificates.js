const { body } = require('express-validator');

const validCertificateOptions = ['yes', 'no'];

const ruleCertificates = () =>
  body('do-you-have-certificates')
    .notEmpty()
    .withMessage('Select your site ownership and agricultural holdings certificate')
    .bail()
    .isIn(validCertificateOptions);

const rules = () => [ruleCertificates()];

module.exports = {
  rules,
  validCertificateOptions,
};
