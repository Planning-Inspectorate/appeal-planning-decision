const BusinessRuleError = require('./business-rule-error');

describe('lib/business-rule-error', () => {
  it('should return an object with the correct params', () => {
    const businessRuleError = new BusinessRuleError('Schema not found');

    expect(businessRuleError).toBeInstanceOf(Error);
    expect(businessRuleError.name).toEqual('BusinessRuleError');
    expect(businessRuleError.message).toEqual('Schema not found');
    expect(businessRuleError.errors).toEqual(['Schema not found']);
  });
});
