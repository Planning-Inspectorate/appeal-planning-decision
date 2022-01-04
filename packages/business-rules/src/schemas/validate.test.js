const mockAppeal = {
  insert: {
    validate: jest.fn(),
  },
  update: {
    validate: jest.fn(),
  },
};

jest.mock('./householder-appeal', () => mockAppeal);
jest.mock('./full-appeal', () => mockAppeal);

const { insert, update, validate } = require('./validate');
const householderAppeal = require('./householder-appeal');
const fullAppeal = require('./full-appeal');
const { APPEAL_ID } = require('../constants');

describe('schemas/validate', () => {
  let appeal;
  let config;
  let action;

  beforeEach(() => {
    appeal = { id: 'c6065a85-f8a6-418e-b3ea-6395d8372c39' };
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

      expect(() => validate(action, appeal)).toThrow('No schema found for appeal type 1000');
    });

    it('should throw an error for an appeal type when the data fails validation', () => {
      appeal = { appealType: APPEAL_ID.HOUSEHOLDER };

      householderAppeal.insert.validate.mockImplementation(() => {
        throw new Error('id is a required field');
      });

      expect(() => validate(action, appeal)).toThrow('id is a required field');
    });
  });

  describe('insert', () => {
    it('should return the correct data for a householder appeal insert', () => {
      appeal.appealType = APPEAL_ID.HOUSEHOLDER;

      householderAppeal.insert.validate.mockReturnValue(appeal);

      const result = insert(appeal);

      expect(householderAppeal.insert.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.insert.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should return the correct data for a full appeal insert', () => {
      appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;

      fullAppeal.insert.validate.mockReturnValue(appeal);

      const result = insert(appeal);

      expect(fullAppeal.insert.validate).toHaveBeenCalledTimes(1);
      expect(fullAppeal.insert.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });
  });

  describe('update', () => {
    it('should return the correct data for a householder appeal update', () => {
      appeal.appealType = APPEAL_ID.HOUSEHOLDER;

      householderAppeal.update.validate.mockReturnValue(appeal);

      const result = update(appeal);

      expect(householderAppeal.update.validate).toHaveBeenCalledTimes(1);
      expect(householderAppeal.update.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should return the correct data for a full appeal update', () => {
      appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;

      fullAppeal.update.validate.mockReturnValue(appeal);

      const result = update(appeal);

      expect(fullAppeal.update.validate).toHaveBeenCalledTimes(1);
      expect(fullAppeal.update.validate).toHaveBeenCalledWith(appeal, config);
      expect(result).toEqual(appeal);
    });
  });
});
