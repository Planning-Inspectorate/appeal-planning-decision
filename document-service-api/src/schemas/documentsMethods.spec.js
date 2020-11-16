jest.mock('uuid');

const uuid = require('uuid');
const DocumentsMethods = require('./documentsMethods');

describe('Documents methods', () => {
  describe('#generateUUID', () => {
    it('should add a uuid.v4', () => {
      const value = 'some-uuid';
      const obj = new DocumentsMethods();
      obj.set = jest.fn();
      uuid.v4.mockReturnValue(value);

      obj.generateUUID();

      expect(obj.set).toBeCalledWith('uuid', value);
    });
  });
});
