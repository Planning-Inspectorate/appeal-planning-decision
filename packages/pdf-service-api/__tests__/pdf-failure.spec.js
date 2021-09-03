const { generatePdf } = require('../controllers/pdf');
const { mockReq, mockRes } = require('../../mocks/mocks');

jest.mock('../lib/pdfUtils', () => {
  const toPDF = {
    pipe: jest.fn(),
  };
  return () => {
    throw new Error(`Some error for ${toPDF}`);
  };
});

describe('Pdf API - failed request', () => {
  const htmlContent = '<html><h1>Simple html file</h1></html>';
  const buffer = Buffer.from(`${htmlContent}`, 'utf-8');
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    req.files = { htmlFile: { data: buffer, name: 'testAppealFile.html' } };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('POST /api/v1/pdf - It responds with an error', async () => {
    await generatePdf(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith('Provided html file was invalid');
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});
