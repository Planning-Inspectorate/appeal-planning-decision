const { get } = require('./router-mock');
const applicationNameController = require('../../../src/controllers/application-name');

describe('routes/application-name', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/application-name');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', applicationNameController.getApplicationName);
  });
});
