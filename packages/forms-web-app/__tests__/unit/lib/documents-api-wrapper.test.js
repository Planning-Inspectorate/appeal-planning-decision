const fetch = require('node-fetch');
const { documentTypes } = require('@pins/common');
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
    let data;

    beforeEach(() => {
      mockAppeal = { id: 123 };
      data = {
        tempFilePath: 'some/fake/file.ext',
      };
    });

    it('should throw if fetch fails', async () => {
      fetch.mockReject(new Error('fake error message'));
      expect(
        createDocument(mockAppeal, data, null, documentTypes.appealStatement.name)
      ).rejects.toThrow('fake error message');
    });

    it('should throw if the remote API response is not ok', async () => {
      fetch.mockResponse('fake response body', { status: 400 });
      try {
        await createDocument(mockAppeal, data, null, documentTypes.appealStatement.name);
        expect('to be').not.toBe('to be');
      } catch (e) {
        expect(e.message).toBe('Bad Request');
      }
    });

    it('should throw if the response code is anything other than a 202', async () => {
      fetch.mockResponse('a response body', { status: 204 });
      try {
        await createDocument(mockAppeal, data, null, documentTypes.appealStatement.name);
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
        await createDocument(mockAppeal, data, null, documentTypes.appealStatement.name);
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
          await createDocument(mockAppeal, data, null, documentTypes.appealStatement.name);
          expect('to be').not.toBe('to be');
        } catch (e) {
          expect(e.message).toBe('Document had no ID');
        }
      });
    });

    [null, undefined].forEach((given) => {
      it(`should throw if the document response 'id' is ${given}`, async () => {
        try {
          await createDocument(mockAppeal, given, null, documentTypes.appealStatement.name);
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
      expect(
        await createDocument(mockAppeal, data, null, documentTypes.appealStatement.name)
      ).toEqual({
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

      expect(
        await createDocument(
          mockAppeal,
          data,
          'namePreferred.pdf',
          documentTypes.appealStatement.name
        )
      ).toEqual({
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
      expect(
        await createDocument(
          mockAppeal,
          Buffer.from('data'),
          null,
          documentTypes.appealStatement.name
        )
      ).toEqual({
        applicationId: 123,
        id: '123-abc-456-xyz',
        name: 'tmp-2-1607684291243',
      });
    });
  });
});
