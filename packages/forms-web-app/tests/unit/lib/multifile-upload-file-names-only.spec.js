const multifileUploadFileNamesOnly = require('../../../src/lib/multifile-upload-file-names-only');

describe('lib/multifile-upload-file-names-only', () => {
  [
    {
      description: 'empty input',
      given: [],
      expected: [],
    },
    {
      description: 'one valid file',
      given: [
        {
          a: 'b',
          originalFileName: 'abc',
        },
      ],
      expected: ['abc'],
    },
    {
      description: 'two valid files',
      given: [
        {
          a: 'b',
          originalFileName: 'abc',
        },
        {
          any: 'thing',
          originalFileName: 'def',
        },
      ],
      expected: ['abc', 'def'],
    },
    {
      description: 'can have duplicate file names',
      given: [
        {
          originalFileName: 'abc',
        },
        {
          originalFileName: 'abc',
        },
      ],
      expected: ['abc', 'abc'],
    },
    {
      description: 'ignore bad file',
      given: [
        {
          a: 'abc',
        },
      ],
      expected: [],
    },
    {
      description: 'full example',
      given: [
        {
          a: 'b',
          originalFileName: 'abc',
        },

        {
          a: 'abc',
        },
        {
          any: 'thing',
          originalFileName: 'def',
        },
      ],
      expected: ['abc', 'def'],
    },
  ].forEach(({ description, given, expected }) => {
    it(`should give the expected output - ${description}`, () => {
      expect(multifileUploadFileNamesOnly(given)).toEqual(expected);
    });
  });
});
