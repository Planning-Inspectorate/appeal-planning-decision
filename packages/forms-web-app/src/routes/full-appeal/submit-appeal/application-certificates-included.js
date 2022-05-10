const express = require('express');
const router = express.Router();

const applicationCertificatesIncludedController = require('../../../controllers/full-appeal/submit-appeal/application-certificates-included');

const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: certificatesIncludedValidationRules,
} = require('../../../validators/full-appeal/submit-appeal/application-certificates-included');

router.get(
  '/submit-appeal/application-certificates-included',
  applicationCertificatesIncludedController.getApplicationCertificatesIncluded
);

router.post(
  '/submit-appeal/application-certificates-included',
  certificatesIncludedValidationRules(),
  validationErrorHandler,
  applicationCertificatesIncludedController.postApplicationCertificatesIncluded
);

module.exports = router;
