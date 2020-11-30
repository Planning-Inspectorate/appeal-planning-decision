const fileSizeDisplayHelper = require('../../../src/lib/file-size-display-helper');

describe('lib/file-size-display-helper', () => {
  [
    {
      given: 0,
      expected: '0 Bytes',
    },
    {
      given: 1,
      expected: '1 Bytes',
    },
    {
      given: 1024,
      expected: '1 KB',
    },
    {
      given: 1024 ** 2,
      expected: '1 MB',
    },
    {
      given: 1024 ** 3,
      expected: '1 GB',
    },
    {
      given: 1024 ** 4,
      expected: '1 TB',
    },
    {
      given: 1024 ** 5,
      expected: '1 PB',
    },
    {
      given: 1024 ** 6,
      expected: '1 EB',
    },
    {
      given: 1024 ** 7,
      expected: '1 ZB',
    },
    {
      given: 1024 ** 8,
      expected: '1 YB',
    },
  ].forEach(({ given, expected }) => {
    it(`should display the expected file size - ${expected}`, () => {
      expect(fileSizeDisplayHelper(given)).toBe(expected);
    });
  });
});
