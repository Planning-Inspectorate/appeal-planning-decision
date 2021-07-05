const fetch = require('node-fetch');
const { createDocument, getDocument } = require('../../../src/lib/documents-api-wrapper');

const config = require('../../../src/config');

const mockLogger = jest.fn();

config.documents.url = 'http://fake.url';

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
    let data;

    beforeEach(() => {
      mockAppeal = { id: 123 };
      data = {
        tempFilePath: 'some/fake/file.ext',
      };
    });

    it('should throw if fetch fails', async () => {
      fetch.mockReject(new Error('fake error message'));
      expect(createDocument(mockAppeal, data)).rejects.toThrow('fake error message');
    });

    it('should throw if the remote API response is not ok', async () => {
      fetch.mockResponse('fake response body', { status: 400 });
      try {
        await createDocument(mockAppeal, data);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('Bad Request');
      }
    });

    it('should throw if the response code is anything other than a 202', async () => {
      fetch.mockResponse('a response body', { status: 204 });
      try {
        await createDocument(mockAppeal, data);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('No Content');
      }
    });

    it('should throw if the document response is missing an `id`', async () => {
      fetch.mockResponse(
        JSON.stringify({
          name: 'tmp-2-1607684291243',
        }),
        { status: 202 }
      );
      try {
        await createDocument(mockAppeal, data);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('Document had no ID');
      }
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

        try {
          await createDocument(mockAppeal, data);
          expect('to be').not.toBe('to be');
        } catch (e) {
          expect(e.message).toBe('Document had no ID');
        }
      });
    });

    [null, undefined].forEach((given) => {
      it(`should throw if the document response 'id' is ${given}`, async () => {
        try {
          await createDocument(mockAppeal, given);
          expect('to be').not.toBe('to be');
        } catch (e) {
          expect(e.message).toBe(
            'Error: The type of provided data to create a document with is wrong'
          );
        }
      });
    });

    it('should return the expected response if the fetch status is 202 with form data input', async () => {
      fetch.mockResponse(
        JSON.stringify({
          applicationId: 123,
          id: '123-abc-456-xyz',
          name: 'tmp-2-1607684291243',
        }),
        { status: 202 }
      );
      expect(await createDocument(mockAppeal, data)).toEqual({
        applicationId: 123,
        id: '123-abc-456-xyz',
        name: 'tmp-2-1607684291243',
      });
    });

    it('should return the expected response if the fetch status is 202 with form data input with name overrided', async () => {
      fetch.mockResponse(
        JSON.stringify({
          applicationId: 123,
          id: '123-abc-456-xyz',
          name: 'namePreferred.pdf',
        }),
        { status: 202 }
      );

      expect(await createDocument(mockAppeal, data, 'namePreferred.pdf')).toEqual({
        applicationId: 123,
        id: '123-abc-456-xyz',
        name: 'namePreferred.pdf',
      });
    });

    it('should return the expected response if the fetch status is 202 with data buffer input', async () => {
      fetch.mockResponse(
        JSON.stringify({
          applicationId: 123,
          id: '123-abc-456-xyz',
          name: 'tmp-2-1607684291243',
        }),
        { status: 202 }
      );
      expect(await createDocument(mockAppeal, Buffer.from('data'))).toEqual({
        applicationId: 123,
        id: '123-abc-456-xyz',
        name: 'tmp-2-1607684291243',
      });
    });
  });

  describe('getDocument', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getDocument('123', '456');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/123/456/file');
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
        status: 400,
      });

      /**
       * Non-standard way to handle functions that throw in Jest.
       * I believe this is because of `utils.promiseTimout`.
       */
      try {
        await getDocument('123', '456');
      } catch (e) {
        expect(e.toString()).toEqual('Error: something went wrong');
      }
    });
  });
});
