const express = require('express');
const certificatesController = require('../../../controllers/full-appeal/submit-appeal/certificates');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const { documentTypes } = require('@pins/common');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.ownershipCertificate.name;

router.get(
  '/submit-appeal/certificates',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  certificatesController.getCertificates
);

router.post(
  '/submit-appeal/certificates',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your ownership certificate and agricultural land declaration'),
  validationErrorHandler,
  certificatesController.postCertificates
);

module.exports = router;
