const { createToken } = require('../../../src/services/save-and-return.service');

describe('save-and-return service', () => {
  it('should create token', () => {
    expect(createToken().toString()).toMatch(/\d{5}/);
  });
});
