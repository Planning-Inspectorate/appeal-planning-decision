const fetch = require('node-fetch');
const { createDocument } = require('../../../src/lib/documents-api-wrapper');

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

describe('lib/documents-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('createDocument', () => {
    let mockAppeal;
    let formData;

    beforeEach(() => {
      mockAppeal = { id: 123 };
      formData = {
        tempFilePath: 'some/fake/file.ext',
      };
    });

    it('should throw if fetch fails', async () => {
      fetch.mockReject(new Error('fake error message'));
      expect(createDocument(mockAppeal, formData)).rejects.toThrow('fake error message');
    });

    it('should throw if the remote API response is not ok', () => {
      fetch.mockResponse('fake response body', { status: 400 });
      expect(createDocument(mockAppeal, formData)).rejects.toThrow('Bad Request');
    });

    it('should throw if the response code is anything other than a 202', async () => {
      fetch.mockResponse('a response body', { status: 204 });
      expect(createDocument(mockAppeal, formData)).rejects.toThrow('No Content');
    });

    it('should throw if the document response is missing an `id`', async () => {
      fetch.mockResponse(
        JSON.stringify({
          name: 'tmp-2-1607684291243',
        }),
        { status: 202 }
      );
      expect(createDocument(mockAppeal, formData)).rejects.toThrow('Document had no ID');
    });

    [null, undefined].forEach((given) => {
      it(`should throw if the document response 'id' is ${given}`, async () => {
        fetch.mockResponse(
          JSON.stringify({
            id: given,
            name: 'tmp-2-1607684291243',
          }),
          { status: 202 }
        );
        expect(createDocument(mockAppeal, formData)).rejects.toThrow('Document had no ID');
      });
    });

    it('should return the expected response if the fetch status is 202', async () => {
      fetch.mockResponse(
        JSON.stringify({
          applicationId: 123,
          id: '123-abc-456-xyz',
          name: 'tmp-2-1607684291243',
        }),
        { status: 202 }
      );
      expect(await createDocument(mockAppeal, formData)).toEqual({
        applicationId: 123,
        id: '123-abc-456-xyz',
        name: 'tmp-2-1607684291243',
      });
    });
  });
});
