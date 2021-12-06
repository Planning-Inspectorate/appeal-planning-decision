const { get } = require('../router-mock');
const {
  getAnyOfFollowing,
} = require('../../../../src/controllers/before-you-start/any-of-following');

describe('routes/before-you-start/any-of-following', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/any-of-following');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', getAnyOfFollowing);
  });
});
