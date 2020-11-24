const { get } = require('../router-mock');
const uploadDecisionController = require('../../../../src/controllers/appellant-submission/upload-decision');

describe('routes/appellant-submission/upload-decision', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/upload-decision');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/upload-decision',
      uploadDecisionController.getUploadDecision
    );
  });
});
