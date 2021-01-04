const express = require('express');

const supportingDocumentsController = require('../../controllers/appellant-submission/supporting-documents');

const router = express.Router();

router.get('/supporting-documents', supportingDocumentsController.getSupportingDocuments);

module.exports = router;
