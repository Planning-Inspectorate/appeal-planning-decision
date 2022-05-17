const { body } = require('express-validator');

const separateCertificateSubmittedOptions = ['yes', 'no'];

const ruleSeparateCertificates = () =>
  body('did-you-submit-separate-certificate')
    .notEmpty()
    .withMessage(
      'Select yes if you submitted a separate ownership certificate and agricultural land declaration'
    )
    .bail()
    .isIn(separateCertificateSubmittedOptions);

const rules = () => [ruleSeparateCertificates()];

module.exports = {
  rules,
  separateCertificateSubmittedOptions,
};
