const fetch = require('node-fetch');
const { generatePDF } = require('../../../src/lib/pdf-api-wrapper');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    warn: mockLogger,
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123-abc-456-xyz'),
}));

describe('lib/pdf-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('generatePDF', () => {
    let mockAppeal;
    let htmlContent;

    beforeEach(() => {
      mockAppeal = { id: 123 };
      htmlContent = '<html><h1>Simple html file</h1></html>';
    });

    it('should throw if fetch fails', async () => {
      fetch.mockReject(new Error('fake error message'));
      expect(generatePDF(mockAppeal.id, htmlContent)).rejects.toThrow('fake error message');
    });

    it('should throw if the remote API response is not ok', () => {
      fetch.mockResponse('fake response body', { status: 400 });
      expect(generatePDF(mockAppeal, htmlContent)).rejects.toThrow('Bad Request');
    });

    it('should throw if the response code is anything other than a 202', async () => {
      fetch.mockResponse('a response body', { status: 204 });
      expect(generatePDF(mockAppeal.id, htmlContent)).rejects.toThrow('No Content');
    });

    it('should return the expected response if the fetch status is 200', async () => {
      const pdfGenerated = 'pdf generated';
      fetch.mockResponse(pdfGenerated, { status: 200 });
      const expectedResult = new TextEncoder().encode(pdfGenerated);

      const result = await generatePDF(mockAppeal.id, htmlContent);

      expect(result).toEqual(Buffer.from(expectedResult));
    });
  });
});
