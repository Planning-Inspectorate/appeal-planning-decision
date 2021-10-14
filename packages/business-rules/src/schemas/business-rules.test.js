const businessRules = require('./business-rules');
const householderAppeal = require('./householder-appeal');
const { APPEAL_ID } = require('../constants');

jest.mock('./householder-appeal', () => ({
  validate: jest.fn(),
}));

describe('schemas/business-rules', () => {
  const appeal = { appeal: true };
  const config = { config: true };

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => businessRules('100', appeal, config)).toThrow('100 is not a valid appeal type');
  });

  it('should throw an error if no schema is found', () => {
    expect(() => businessRules(APPEAL_ID.ENFORCEMENT_NOTICE, appeal, config)).toThrow(
      'No business rules schema found for 100',
    );
  });

  it('should return the correct schema for a Householder Appeal', () => {
    businessRules(APPEAL_ID.HOUSEHOLDER, appeal, config);
    expect(householderAppeal.validate).toHaveBeenCalledTimes(1);
    expect(householderAppeal.validate).toHaveBeenCalledWith(appeal, config);
  });
});
