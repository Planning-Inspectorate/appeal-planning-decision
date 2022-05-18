const { get, post } = require('../../router-mock');

const applicationCertificatesIncludedController = require('../../../../../src/controllers/full-appeal/submit-appeal/application-certificates-included');

const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/validators/common/options');

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
      optionsValidationRules(),
      validationErrorHandler,
      applicationCertificatesIncludedController.postApplicationCertificatesIncluded
    );

    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'did-you-submit-separate-certificate',
      emptyError:
        'Select yes if you submitted a separate ownership certificate and agricultural land declaration',
      validOptions: ['yes', 'no'],
    });
  });
});
