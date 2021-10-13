const { get } = require('./router-mock');
const alreadySubmittedController = require('../../../src/controllers/already-submitted');

describe('routes/already-submitted', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/already-submitted');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/appeal-questionnaire/:id/already-submitted',
      alreadySubmittedController.getAlreadySubmitted
    );
  });
});
