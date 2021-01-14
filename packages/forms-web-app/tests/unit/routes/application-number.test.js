const { get, post } = require('./router-mock');
const applicationNumberController = require('../../../src/controllers/application-number');

describe('routes/application-number', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/application-number');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', applicationNumberController.getApplicationNumber);
    expect(post).toHaveBeenCalledWith('/', applicationNumberController.postApplicationNumber);
  });
});
