jest.mock('uuid');

const uuid = require('uuid');
const DocumentsMethods = require('./documentsMethods');

describe('Documents methods', () => {
  describe('#generateId', () => {
    it('should add a uuid.v4', () => {
      const value = 'some-uuid';
      const obj = new DocumentsMethods();
      obj.set = jest.fn();
      uuid.v4.mockReturnValue(value);

      expect(obj.generateId()).toBe(obj);

      expect(obj.set).toBeCalledWith('id', value);
    });
  });

  describe('#toDTO', () => {
    it('should return the DTO with an undefined _id', () => {
      const data = {
        _id: 'some-id',
        applicationId: 'some-app',
      };

      const obj = new DocumentsMethods();

      /* Default Mongoose method */
      obj.toObject = jest.fn().mockReturnValue(data);

      expect(obj.toDTO()).toEqual({
        ...data,
        _id: undefined,
      });
    });
  });
});
