jest.mock('uuid');

const uuid = require('uuid');
const AppealsMethods = require('./appealsMethods');

describe('Appeals methods', () => {
  describe('#generateUUID', () => {
    it('should add a uuid.v4', () => {
      const value = 'some-uuid';
      const obj = new AppealsMethods();
      obj.set = jest.fn();
      uuid.v4.mockReturnValue(value);

      obj.generateUUID();

      expect(obj.set).toBeCalledWith('uuid', value);
    });
  });
});
