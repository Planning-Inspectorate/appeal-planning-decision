const { get, post } = require('../../router-mock');

const applicationCertificatesIncludedController = require('../../../../../src/controllers/full-appeal/submit-appeal/application-certificates-included');

const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: certificatesIncludedValidationRules,
} = require('../../../../../src/validators/full-appeal/submit-appeal/application-certificates-included');

jest.mock(
  '../../../../../src/validators/full-appeal/submit-appeal/application-certificates-included'
);

describe('routes/full-appeal/submit-appeal/application-certificates-included', () => {
  beforeEach(() => {
    require('../../../../../src/routes/full-appeal/submit-appeal/application-certificates-included');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/application-certificates-included',
      applicationCertificatesIncludedController.getApplicationCertificatesIncluded
    );

    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/application-certificates-included',
      certificatesIncludedValidationRules(),
      validationErrorHandler,
      applicationCertificatesIncludedController.postApplicationCertificatesIncluded
    );
  });
});
