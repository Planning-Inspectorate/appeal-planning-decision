const { migrate } = require('../controllers/migrateMetadata');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/migrateMetadata', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./migrateMetadata');

    expect(mockGet).toBeCalledWith('/', migrate);
  });
});
