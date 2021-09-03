const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const informationSubmittedController = require('../../../src/controllers/information-submitted');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');

describe('routes/information-submitted', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/information-submitted');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/${VIEW.INFORMATION_SUBMITTED}`,
      fetchAppealMiddleware,
      informationSubmittedController.getInformationSubmitted
    );
  });
});
