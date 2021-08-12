jest.mock('uuid');
jest.mock('../../src/lib/blobStorage');

const uuid = require('uuid');
const DocumentsMethods = require('../../src/schemas/documentsMethods');
const { connectToBlobStorage, downloadFromBlobStorage } = require('../../src/lib/blobStorage');

describe('Documents methods', () => {
  describe('#downloadFileBuffer', () => {
    it('should download a file buffer', async () => {
      const connection = 'some-connection';
      connectToBlobStorage.mockResolvedValue(connection);

      const fileBuffer = Buffer.from('hello world');
      downloadFromBlobStorage.mockResolvedValue(fileBuffer);

      const location = 'some-location';
      const obj = new DocumentsMethods();
      obj.get = jest.fn().mockReturnValue(location);

      expect(await obj.downloadFileBuffer()).toBe(fileBuffer);

      expect(downloadFromBlobStorage).toBeCalledWith(location, connection);
    });
  });

  describe('#generateId', () => {
    it('should add a uuid.v4', () => {
      const value = 'some-uuid';
      const obj = new DocumentsMethods();
      obj.set = jest.fn();
      uuid.v4.mockReturnValue(value);

      expect(obj.generateId()).toBe(obj);

      expect(obj.set).toBeCalledWith('id', value);
    });
  });

  describe('#toDTO', () => {
    it('should return the DTO with an undefined _id', () => {
      const data = {
        _id: 'some-id',
        applicationId: 'some-app',
      };

      const obj = new DocumentsMethods();

      /* Default Mongoose method */
      obj.toObject = jest.fn().mockReturnValue(data);

      expect(obj.toDTO()).toEqual({
        ...data,
        _id: undefined,
      });
    });
  });
});
