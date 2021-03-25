const { Router } = require('express');
const documentController = require('../controllers/documents');

const routes = Router({ mergeParams: true });

routes
  .get('/', documentController.getDocsForApplication)
  .post('/', ...documentController.uploadDocument)
  .get('/:documentId', documentController.getDocumentById)
  .get('/:documentId/file', documentController.serveDocumentById)
  .delete('/:documentId', documentController.deleteDocument);

module.exports = routes;
