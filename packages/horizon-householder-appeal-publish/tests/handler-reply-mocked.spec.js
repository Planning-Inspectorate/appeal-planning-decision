jest.mock('axios');
jest.mock('../src/publishDocuments');
const axios = require('axios');

process.env.GATEWAY_URL = 'openfaas-gateway';

const { handlerReply } = require('../handler-reply');
const { publishDocuments } = require('../src/publishDocuments');

describe('handlerReply', () => {
  const envvars = process.env;
  let context;
  let logMock;

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
  });

  afterEach(() => {
    process.env = envvars;
    axios.post.mockReset();
  });

  it('should simulate a failed Horizon call', async () => {
    const lpaCode = 'mock-lpa-code';

    const event = {
      log: logMock,
      body: {
        reply: {
          lpaCode,
        },
      },
    };

    const mockError = new Error('Error sending to Horizon');
    mockError.request = true; // To elicit correct response in catchErrorHandling()
    publishDocuments.mockRejectedValue(mockError);

    expect(await handlerReply(event, context)).toEqual({
      message: 'Error sending to Horizon',
    });

    expect(context).toEqual({
      httpStatus: 400,
    });
  });
});
