const express = require('express');
const router = express.Router();

const certificatesController = require('../../../controllers/full-appeal/submit-appeal/certificates');

const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: certificatesValidationRules,
} = require('../../../validators/full-appeal/submit-appeal/certificates');

router.get('/submit-appeal/certificates', certificatesController.getCertificates);

router.post(
  '/submit-appeal/certificates',
  certificatesValidationRules(),
  validationErrorHandler,
  certificatesController.postCertificates
);

module.exports = router;
