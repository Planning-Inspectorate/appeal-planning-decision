const handler = require('./handler');

describe('handler', () => {
  it('should simulate a successful call', () => {
    const body = { hello: 'world' };

    expect(handler({ body })).toEqual({
      status: `Received input: ${JSON.stringify(body)}`,
    });
  });
});
