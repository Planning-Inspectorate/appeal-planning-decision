const { generatePdf } = require('../controllers/pdf');
const { mockReq, mockRes } = require('../../mocks/mocks');
const { toPDF } = require('../lib/pdfUtils');

jest.mock('../lib/pdfUtils', () => ({
  toPDF: jest.fn().mockResolvedValue({
    pipe: () => true,
  }),
}));

describe('Pdf API', () => {
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
    expect(toPDF).toHaveBeenCalledTimes(1);
    expect(toPDF).toHaveBeenCalledWith(`${htmlContent}`);
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

  test('POST /api/v1/pdf - It responds with an error', async () => {
    toPDF.mockRejectedValue('some error');
    await generatePdf(req, res);
    expect(toPDF).toHaveBeenCalledTimes(1);
    expect(toPDF).toHaveBeenCalledWith(`${htmlContent}`);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ code: 400, error: 'Provided html file was invalid' });
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});
