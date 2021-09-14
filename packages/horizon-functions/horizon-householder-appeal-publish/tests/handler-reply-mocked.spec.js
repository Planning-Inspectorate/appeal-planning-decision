const axios = require('axios');
const { handlerReply } = require('../handler-reply');
const { publishDocuments } = require('../src/publishDocuments');
const { getHorizonId } = require('../src/getHorizonId');

jest.mock('axios');
jest.mock('../src/publishDocuments');
jest.mock('../src/getHorizonId');

process.env.GATEWAY_URL = 'openfaas-gateway';

describe('handlerReply', () => {
  const envvars = process.env;
  let context;
  let logMock;
  let lpaCode;
  let event;

  beforeEach(() => {
    process.env = { ...envvars };

    logMock = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    context = {
      httpStatus: 200,
    };

    lpaCode = 'mock-lpa-code';

    event = {
      log: logMock,
      body: {
        reply: {
          lpaCode,
        },
      },
    };
  });

  afterEach(() => {
    process.env = envvars;
    axios.post.mockReset();
  });

  it('should simulate a failed Horizon call', async () => {
    getHorizonId.mockResolvedValue('mock-horizon-id');

    const mockError = new Error('Error sending to Horizon');
    mockError.request = true;
    publishDocuments.mockRejectedValue(mockError);

    expect(await handlerReply(event, context)).toEqual({
      message: 'Error sending to Horizon',
    });

    expect(context).toEqual({
      httpStatus: 400,
    });
  });

  it('should simulate a failed Appeals Service API called for a horizonId', async () => {
    const mockError = new Error('Horizon failed due to non-existant horizonId');
    mockError.request = true;
    getHorizonId.mockRejectedValue(mockError);

    expect(await handlerReply(event, context)).toEqual({
      message: 'Horizon failed due to non-existant horizonId',
    });

    expect(context).toEqual({
      httpStatus: 500,
    });
  });
});
