const { get } = require('./router-mock');
const guidancePagesController = require('../../../src/controllers/guidance-pages');

describe('routes/guidance-pages', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/guidance-pages');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/before-you-appeal', guidancePagesController.getBeforeAppeal);
    expect(get).toHaveBeenCalledWith('/when-you-can-appeal', guidancePagesController.getWhenAppeal);
    expect(get).toHaveBeenCalledWith('/after-you-appeal', guidancePagesController.getAfterAppeal);
    expect(get).toHaveBeenCalledWith('/start-your-appeal', guidancePagesController.getStartAppeal);
    expect(get).toHaveBeenCalledWith(
      '/stages-of-an-appeal',
      guidancePagesController.getStagesAppeal
    );
  });
});
