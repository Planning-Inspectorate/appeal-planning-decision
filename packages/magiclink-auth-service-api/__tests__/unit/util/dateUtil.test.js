const dateUtil = require('../../../src/util/dateUtil');

describe('utils.dateUtil', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(1629300347000);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('addMillisToCurrentDate', () => {
    it('should return the date modified', () => {
      const date = dateUtil.addMillisToCurrentDate(1);

      expect(date.getTime()).toEqual(1629300347001);
    });
  });
});
