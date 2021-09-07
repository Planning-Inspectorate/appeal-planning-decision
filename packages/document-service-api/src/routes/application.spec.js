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

    expect(mockGet).toBeCalledWith('/', getDocumentsForApplication);
    expect(mockPost).toBeCalledWith('/', uploadLocalFile, addFileMetadata, uploadDocument);
    expect(mockGet).toBeCalledWith('/:documentId', getDocumentById);
    expect(mockGet).toBeCalledWith('/:documentId/file', serveDocumentById);
    expect(mockDelete).toBeCalledWith('/:documentId', deleteDocument);
  });
});
