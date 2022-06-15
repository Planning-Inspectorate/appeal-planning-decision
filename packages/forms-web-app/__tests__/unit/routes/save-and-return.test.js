const { post } = require('./router-mock');
const saveAndReturnController = require('../../../src/controllers/save');

describe('routes/save-and-return', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/save');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(post).toHaveBeenCalledWith('/', saveAndReturnController.postSaveAndReturn);
  });
});
