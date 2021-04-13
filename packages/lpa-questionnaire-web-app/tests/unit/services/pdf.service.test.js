const fetch = require('node-fetch');
const { storePdfReply } = require('../../../src/services/pdf.service');
const { getHtmlReply } = require('../../../src/services/pdf.service');
const { createDocument } = require('../../../src/lib/documents-api-wrapper');

jest.mock('../../../src/lib/documents-api-wrapper');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    info: mockLogger,
    warn: mockLogger,
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123-abc-456-xyz'),
}));

describe('services/pdf.service', () => {
  let mockReply;
  let htmlContent;

  beforeEach(() => {
    mockReply = { id: 123 };
    htmlContent = '<html><h1>Simple html file</h1></html>';
    fetch.resetMocks();
  });

  describe('getHtmlReply', () => {
    it('should throw error if fetch rejects the supplied document', async () => {
      fetch.mockReject(new Error('fake error message'));
      expect(getHtmlReply(mockReply)).rejects.toThrow('fake error message');
    });

    it('should throw if the remote API response is not a status ', () => {
      fetch.mockResponse('fake response body', { status: 400 });
      expect(getHtmlReply(mockReply)).rejects.toThrow('Bad Request');
    });

    it('should throw if the response code is anything other than a 202', async () => {
      fetch.mockResponse('a response body', { status: 204 });
      expect(getHtmlReply(mockReply)).rejects.toThrow('No Content');
    });

    it('should return the expected response if the fetch status is 200', async () => {
      fetch.mockResponse(htmlContent, { status: 200 });
      expect(await getHtmlReply(mockReply)).toEqual(htmlContent);
    });
  });

  describe('storePdfReply', () => {
    it('should throw if the get html reply API response is not ok', async () => {
      fetch.mockResponse(htmlContent, { status: 400 });
      await createDocument.mockResolvedValue({ data: [] });
      try {
        await storePdfReply(mockReply);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('Error during the reply pdf generation');
      }
    });

    it('should throw if the create document API response is not ok', async () => {
      fetch.mockResponse(htmlContent, { status: 200 });
      createDocument.mockImplementation(() => Promise.reject(new Error()));
      try {
        await storePdfReply(mockReply);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('Error during the reply pdf generation');
      }
    });

    it('should return the expected response if no error were triggered fetch status is 200', async () => {
      await createDocument.mockResolvedValue({ data: [] });
      fetch.mockResponse(htmlContent, { status: 200 });
      expect(await storePdfReply(mockReply)).toEqual({ data: [] });
    });
  });
});
