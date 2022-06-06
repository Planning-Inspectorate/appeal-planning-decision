const { get } = require('../router-mock');

const enterAppealDetailsController = require('../../../../src/controllers/submit-appeal/enter-appeal-details');

describe('routes/submit-appeal/enter-appeal-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/submit-appeal');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/enter-appeal-details',
      enterAppealDetailsController.getEnterAppealDetails
    );
  });
});
