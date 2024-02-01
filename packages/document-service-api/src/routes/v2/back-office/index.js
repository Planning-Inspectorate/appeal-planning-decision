const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { getDocumentUrl, downloadDocument } = require('./controller');
const router = express.Router();

router.post('/sas-url', asyncHandler(getDocumentUrl));
router.get('/:document', asyncHandler(downloadDocument));

module.exports = { router };
