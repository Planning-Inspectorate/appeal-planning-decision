const { postGeneratePdf } = require('./pdf');
const generatePdf = require('../lib/generatePdf');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/generatePdf');

describe('controllers/pdf', () => {
  const res = mockRes();
  const html = '<html><body><p>A test pdf</p></body></html>';
  const pdfBuffer = Buffer.from(html);

  let req;

  beforeEach(() => {
    req = {
      ...mockReq,
      body: {
        html,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postGeneratePdf', () => {
    it('should return a pdf when a pdf is generated successfully', async () => {
      generatePdf.mockReturnValue(pdfBuffer);

      await postGeneratePdf(req, res);

      expect(generatePdf).toBeCalledTimes(1);
      expect(generatePdf).toBeCalledWith(html);
      expect(res.contentType).toBeCalledTimes(1);
      expect(res.contentType).toBeCalledWith('application/pdf');
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(pdfBuffer);
    });

    it('should return an error when an error is thrown generating a pdf', async () => {
      generatePdf.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await postGeneratePdf(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
