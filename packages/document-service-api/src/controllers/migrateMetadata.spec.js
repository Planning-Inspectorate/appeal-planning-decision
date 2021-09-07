const { migrate } = require('./migrateMetadata');
const { migrateMetadata } = require('../lib/migrateMetadata');
const { mockReq: req, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/migrateMetadata', () => ({
  migrateMetadata: jest.fn(),
}));

describe('controllers/migrateMetadata', () => {
  const res = mockRes();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('migrate', () => {
    it('should return a summary of the migrated metadata when the migration is successful', async () => {
      const migrateMetadataReturnValue = {
        documentsFound: 1,
        documentsMigrated: 1,
      };

      migrateMetadata.mockReturnValue(migrateMetadataReturnValue);

      await migrate(req, res);

      expect(migrateMetadata).toBeCalledTimes(1);
      expect(migrateMetadata).toBeCalledWith();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(migrateMetadataReturnValue);
    });

    it('should return an error when an error is thrown migrating the metadata', async () => {
      migrateMetadata.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await migrate(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
