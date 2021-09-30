const pdfRouter = require('./pdf');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledTimes(1);
    expect(mockUse).toBeCalledWith('/api/v1', pdfRouter);
  });
});
