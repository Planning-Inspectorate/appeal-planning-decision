const { generatePdf } = require('../src/controllers/pdf');
const { mockReq, mockRes } = require('../mocks/mocks');

jest.mock('../lib/pdfUtils', () => {
  const toPDF = {
    pipe: jest.fn(),
  };
  return () => {
    return toPDF;
  };
});

describe('Pdf API - successful response', () => {
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

  test('POST /api/v1/pdf - It responds with a pdf file', async () => {
    await generatePdf(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledTimes(2);
    expect(res.setHeader).toHaveBeenNthCalledWith(1, 'Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenNthCalledWith(
      2,
      'Content-Disposition',
      'attachment; filename="testAppealFile.html.pdf"'
    );
  });
});
