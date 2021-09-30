const { generatePDF } = require('../../../src/lib/pdf-api-wrapper');

jest.mock('node-fetch', () =>
  jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
    .mockImplementationOnce(() => ({
      ok: false,
      statusText: 'Bad Request',
    }))
    .mockImplementationOnce(() => ({
      ok: true,
      status: 401,
      statusText: 'Unauthorized',
    }))
    .mockImplementationOnce(() => ({
      ok: true,
      status: 200,
      buffer: () => 'A pdf value',
    }))
);

describe('lib/pdf-api-wrapper', () => {
  describe('generatePDF', () => {
    const html = '<html><body><p>A test pdf</p></body></html>';

    it('should throw an error if the API request fails', () => {
      expect(generatePDF(html)).rejects.toThrow('Internal Server Error');
    });

    it('should throw an error if the API response is not ok', () => {
      expect(generatePDF(html)).rejects.toThrow('Bad Request');
    });

    it('should throw an error if the API response status is not 200', () => {
      expect(generatePDF(html)).rejects.toThrow('Unauthorized');
    });

    it('should return the pdf', async () => {
      expect(await generatePDF(html)).toEqual('A pdf value');
    });
  });
});
