const BusinessRulesError = require('./business-rules-error');

describe('lib/business-rules-error', () => {
  it('should return an object with the correct params', () => {
    const businessRulesError = new BusinessRulesError('Schema not found');

    expect(businessRulesError).toBeInstanceOf(Error);
    expect(businessRulesError.name).toEqual('BusinessRulesError');
    expect(businessRulesError.message).toEqual('Schema not found');
    expect(businessRulesError.errors).toEqual(['Schema not found']);
  });
});
