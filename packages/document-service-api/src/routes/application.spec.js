const {
  getDocumentsForApplication,
  getDocumentById,
  serveDocumentById,
  uploadDocument,
  deleteDocument,
} = require('../controllers/documents');
const uploadLocalFile = require('../lib/uploadLocalFile');
const addFileMetadata = require('../lib/addFileMetadata');
const { mockGet, mockPost, mockDelete } = require('../../test/utils/mocks');

describe('routes/application', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./application');

    expect(mockGet).toHaveBeenCalledWith('/', getDocumentsForApplication);
    expect(mockPost).toHaveBeenCalledWith('/', uploadLocalFile, addFileMetadata, uploadDocument);
    expect(mockGet).toHaveBeenCalledWith('/:documentId', getDocumentById);
    expect(mockGet).toHaveBeenCalledWith('/:documentId/file', serveDocumentById);
    expect(mockDelete).toHaveBeenCalledWith('/:documentId', deleteDocument);
  });
});
