jest.mock('axios');

const axios = require('axios');
const handler = require('./handler');
// const appealsData = require('../../data/data/appeals-service-api/001-appeals.json');

// console.log(appealsData);

describe.skip('handler', () => {
  let context;
  beforeEach(() => {
    context = {
      fail: jest.fn(),
      status: jest.fn(),
      succeed: jest.fn(),
    };

    Object.keys(context).forEach((key) => {
      context[key].mockReturnValue(context);
    });
  });

  it('should simulate a successful call to horizon', async () => {
    axios.post.mockResolvedValue();

    const event = {};

    await handler(event, context);

    expect(context.status).toBeCalledWith(200);
    expect(context.succeed).toBeCalledWith({});
  });

  it.skip('should simulate a failed call to horizon and error', async () => {
    const error = new Error('err');
    axios.post.mockRejectedValue(error);

    const event = {};

    await handler(event, context);

    expect(context.status).toBeCalledWith(400);
    expect(context.fail).toBeCalledWith(error);
  });
});
