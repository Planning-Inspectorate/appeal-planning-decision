const { insert, update, validate } = require('./validate');
const householderAppeal = require('./householder-appeal');
const { APPEAL_ID } = require('../constants');

jest.mock('./householder-appeal', () => ({
  insert: {
    validate: jest.fn(),
  },
  update: {
    validate: jest.fn(),
  },
}));

describe('schemas/validate', () => {
  let appeal;
  let config;
  let action;

  beforeEach(() => {
    appeal = { appealType: APPEAL_ID.HOUSEHOLDER };
    config = { abortEarly: false };
    action = 'insert';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should throw an error if an invalid appeal type is given', () => {
      appeal.appealType = '100';

      expect(() => validate(action, appeal)).toThrow('100 is not a valid appeal type');
    });

    it('should throw an error if no schema is found', () => {
      appeal.appealType = APPEAL_ID.ENFORCEMENT_NOTICE;

      expect(() => validate(action, appeal)).toThrow(
        'No business rules schema found for appeal type 1000',
      );
    });

    it('should return the correct data for an appeal type when not given config and the data passes validation', () => {
      householderAppeal.insert.validate.mockReturnValue(appeal);

      const result = validate(action, appeal);

      expect(householderAppeal.insert.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.insert.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should return the correct data for an appeal type when given config and the data passes validation', () => {
      householderAppeal.insert.validate.mockReturnValue(appeal);

      const differentConfig = { abortEarly: true };

      const result = validate(action, appeal, differentConfig);

      expect(householderAppeal.insert.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.insert.validate).toHaveBeenCalledWith(appeal, differentConfig);
      expect(result).toEqual(appeal);
    });

    it('should throw an error for an appeal type when the data fails validation', () => {
      householderAppeal.insert.validate.mockImplementation(() => {
        throw new Error('id is a required field');
      });

      expect(() => validate(action, appeal)).toThrow('id is a required field');
    });
  });

  describe('insert', () => {
    it('should return the correct data for an appeal type', () => {
      householderAppeal.insert.validate.mockReturnValue(appeal);

      const result = insert(appeal);

      expect(householderAppeal.insert.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.insert.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });
  });

  describe('update', () => {
    it('should return the correct data for an appeal type', () => {
      householderAppeal.update.validate.mockReturnValue(appeal);

      const result = update(appeal);

      expect(householderAppeal.update.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.update.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });
  });
});
