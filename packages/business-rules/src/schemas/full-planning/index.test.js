const index = require('./index');
const insert = require('./insert');
const update = require('./update');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      insert,
      update,
    });
  });
});
