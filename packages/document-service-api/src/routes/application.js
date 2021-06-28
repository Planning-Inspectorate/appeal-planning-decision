const { Router } = require('express');
const passport = require('passport');
const documentController = require('../controllers/documents');

const routes = Router({ mergeParams: true });

routes
  .get(
    '/',
    passport.authenticate(['fwa-session', 'something-else'], { session: false }),
    documentController.getDocsForApplication
  )
  .post('/', ...documentController.uploadDocument)
  .get('/:documentId', documentController.getDocumentById)
  .get('/:documentId/file', documentController.serveDocumentById)
  .delete('/:documentId', documentController.deleteDocument);

module.exports = routes;
