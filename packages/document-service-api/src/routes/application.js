const { Router } = require('express');
const {
  getDocumentsForApplication,
  getDocumentById,
  serveDocumentById,
  uploadDocument,
  deleteDocument,
} = require('../controllers/documents');
const uploadLocalFile = require('../lib/uploadLocalFile');
const addFileMetadata = require('../lib/addFileMetadata');

const router = Router({ mergeParams: true });

router.get('/', getDocumentsForApplication);
router.post('/', uploadLocalFile, addFileMetadata, uploadDocument);
router.get('/:documentId', getDocumentById);
router.get('/:documentId/file', serveDocumentById);
router.delete('/:documentId', deleteDocument);

module.exports = router;
