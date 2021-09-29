const { get } = require('./router-mock');
const contactUsController = require('../../../src/controllers/contact-us');

describe('routes/contact-us', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/contact-us');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/appeal-questionnaire/contact-us',
      contactUsController.getContactUs
    );
  });
});
