const { get } = require('../router-mock');
const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');

describe('routes/appellant-submission/supporting-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/supporting-documents');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/supporting-documents',
      supportingDocumentsController.getSupportingDocuments
    );
  });
});
