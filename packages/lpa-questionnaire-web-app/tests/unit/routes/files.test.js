const { post } = require('./router-mock');
const filesController = require('../../../src/controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const filesValidationRules = require('../../../src/validators/files');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

jest.mock('../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../src/validators/files');

describe('routes/placeholder', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/files');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(post).toHaveBeenCalledWith(
      '/upload',
      [
        authenticateMiddleware,
        reqFilesToReqBodyFilesMiddleware('documents'),
        filesValidationRules(),
      ],
      validationErrorHandler,
      filesController.uploadFile
    );

    expect(post).toHaveBeenCalledWith(
      '/delete',
      authenticateMiddleware,
      filesController.deleteFile
    );
  });
});
