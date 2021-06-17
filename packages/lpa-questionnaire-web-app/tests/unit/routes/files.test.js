const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { post } = require('./router-mock');
const filesController = require('../../../src/controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const filesValidationRules = require('../../../src/validators/files');

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
      [reqFilesToReqBodyFilesMiddleware('documents'), filesValidationRules()],
      validationErrorHandler,
      filesController.uploadFile
    );

    expect(post).toHaveBeenCalledWith('/delete', filesController.deleteFile);
  });
});
