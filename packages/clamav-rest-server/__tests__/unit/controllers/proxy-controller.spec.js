jest.mock('../../../src/lib/clamd');
const clamd = require('../../../src/lib/clamd');
const controller = require('../../../src/controllers/proxy-controller');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/proxy-controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  it('should process file sent via form data', async () => {
    const mockResponse = clamd.sendFile.mockResolvedValue({
      file: '',
      isInfected: true,
      viruses: [],
    });

    const sampleFile = {
      title: 'sample',
      buffer: Buffer.from([]),
    };

    const mockRequest = {
      ...req,
      files: {
        file: [sampleFile],
      },
    };

    await controller.processFile(mockRequest, res);
    expect(mockResponse).toBeCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      file: '',
      isInfected: true,
      viruses: [],
    });
  });

  it('should return 400 for file is undefined', async () => {
    const mockRequest = {
      ...req,
      files: {
        file: undefined,
      },
    };

    await controller.processFile(mockRequest, res);
    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it('should return message after error', async () => {
    const mockRequest = {
      ...req,
      files: {
        file: [undefined],
      },
    };

    await controller.processFile(mockRequest, res);
    expect(res.send).toHaveBeenCalledWith('error uploading file to clamav');
  });
});
