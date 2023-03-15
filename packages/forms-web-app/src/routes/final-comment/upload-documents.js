const express = require('express');

const uploadDocumentsController = require('../../controllers/final-comment/upload-documents');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');

const router = express.Router();

router.get('/upload-documents', uploadDocumentsController.getUploadDocuments);
router.post(
	'/upload-documents',
	reqFilesToReqBodyFilesMiddleware('upload-documents'),
	uploadDocumentsController.postUploadDocuments
);

module.exports = router;
