const { get } = require('../../router-mock');

const certificatesController = require('../../../../../src/controllers/full-appeal/submit-appeal/certificates');

describe('routes/full-appeal/submit-appeal/certificates', () => {
  beforeEach(() => {
    require('../../../../../src/routes/full-appeal/submit-appeal/certificates');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/certificates',
      certificatesController.getCertificates
    );
  });
});
