const express = require('express');
const router = express.Router();

const applicationCertificatesIncludedController = require('../../../controllers/full-appeal/submit-appeal/application-certificates-included');

const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const { rules: optionsValidationRules } = require('../../../validators/common/options');

router.get(
  '/submit-appeal/application-certificates-included',
  applicationCertificatesIncludedController.getApplicationCertificatesIncluded
);

router.post(
  '/submit-appeal/application-certificates-included',
  optionsValidationRules({
    validOptions: ['yes', 'no'],
    fieldName: 'did-you-submit-separate-certificate',
    emptyError:
      'Select yes if you submitted a separate ownership certificate and agricultural land declaration',
  }),
  validationErrorHandler,
  applicationCertificatesIncludedController.postApplicationCertificatesIncluded
);

module.exports = router;
