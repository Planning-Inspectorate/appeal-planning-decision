const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { getDocumentUrl, downloadDocument } = require('./controller');
const router = express.Router();

router.get('/:document', asyncHandler(getDocumentUrl));
router.get('/download/:document', asyncHandler(downloadDocument));

module.exports = { router };
