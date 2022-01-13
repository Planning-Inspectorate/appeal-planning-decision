const mockFetchDocument = {
  headers: {
    get: (item) => {
      return {
        'x-original-file-name': 'test-pdf.pdf',
        'content-length': 1000,
        'content-type': 'application/pdf',
      }[item];
    },
  },
  body: {
    pipe: jest.fn(),
  },
};

jest.mock('../../../src/lib/documents-api-wrapper', () => ({
  fetchDocument: jest
    .fn()
    .mockImplementationOnce(() => mockFetchDocument)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

const { getDocument } = require('../../../src/controllers/document');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/document', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      ...mockReq(),
      params: {},
    };
    res = {
      ...mockRes(),
      set: jest.fn(),
    };
  });

  describe('getDocument', () => {
    it('should return the document', async () => {
      await getDocument(req, res);

      expect(res.set).toHaveBeenCalledWith({
        'content-length': 1000,
        'content-disposition': `attachment;filename="test-pdf.pdf"`,
        'content-type': 'application/pdf',
      });
      expect(mockFetchDocument.body.pipe).toHaveBeenCalledWith(res);
    });

    it('should return an error if an error is thrown', async () => {
      await getDocument(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
