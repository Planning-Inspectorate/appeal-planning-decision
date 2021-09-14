const apiDocs = require('./apiDocs');
const application = require('./application');
const migrateMetadata = require('./migrateMetadata');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledWith('/api-docs', apiDocs);
    expect(mockUse).toBeCalledWith('/api/v1/migrate-metadata', migrateMetadata);
    expect(mockUse).toBeCalledWith('/api/v1/:applicationId', application);
  });
});
