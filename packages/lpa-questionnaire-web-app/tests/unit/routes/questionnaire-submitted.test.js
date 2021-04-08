const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const questionnaireSubmittedController = require('../../../src/controllers/questionnaire-submitted');

describe('routes/questionnaire-submitted', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/questionnaire-submitted');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:id/${VIEW.QUESTIONNAIRE_SUBMITTED}`,
      questionnaireSubmittedController.getQuestionnaireSubmitted
    );
  });
});
