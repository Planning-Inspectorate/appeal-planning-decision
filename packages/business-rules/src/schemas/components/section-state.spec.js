const appealState = require('./section-state');
const { SECTION_STATE } = require('../../constants');

describe('schemas/components/appeal-state', () => {
  const config = {};

  it('should return the data when given a valid value', async () => {
    const data = SECTION_STATE.IN_PROGRESS;

    const result = await appealState().validate(data, config);
    expect(result).toEqual(data);
  });

  it('should throw an error when given an invalid value', async () => {
    const data = 'PENDING';

    try {
      await appealState().validate(data, config);
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err.message).toEqual(
        `this must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
      );
    }
  });

  it('should throw an error when given a null value', async () => {
    const data = null;

    try {
      await appealState().validate(data, config);
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err.message).toContain(
        'this must be a `string` type, but the final value was: `null`',
      );
    }
  });

  it('should throw an error when not given a value', async () => {
    const data = undefined;

    try {
      await appealState().validate(data, config);
      throw new Error('Expected error not thrown');
    } catch (err) {
      expect(err.message).toEqual('this is a required field');
    }
  });
});
