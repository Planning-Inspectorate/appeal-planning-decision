const { get } = require('../router-mock');

const applicationSavedController = require('../../../../src/controllers/submit-appeal/application-saved');

describe('routes/submit-appeal/application-saved', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/submit-appeal/application-saved');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/application-saved',
      applicationSavedController.getApplicationSaved
    );
  });
});
