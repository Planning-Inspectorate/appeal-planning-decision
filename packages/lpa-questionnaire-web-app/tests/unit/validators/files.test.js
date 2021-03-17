const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const rules = require('../../../src/validators/files');
const { MIME_TYPE_JPEG } = require('../../../src/lib/file-upload-helpers');
const config = require('../../../src/config');

describe('validators/files', () => {
  describe('rules', () => {
    it('has a rule for `files.documents.*`', () => {
      const rule = rules()[0][0].builder.build();

      expect(rule.fields).toEqual(['files.documents.*']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.name).toEqual('options');
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('should have the expected number of configured rules', () => {
      expect(rules().length).toEqual(1);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined / empty - pass ',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'files key is empty - pass',
        given: () => ({
          body: {
            files: [],
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'files path is not matched - pass',
        given: () => ({
          body: {
            files: {
              'something-else': [],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'files path is matched but mime type is wrong - fail',
        given: () => ({
          body: {
            files: {
              documents: [
                {
                  mimetype: 'bad',
                },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title: 'files path is matched but file size is too big - fail',
        given: () => ({
          body: {
            files: {
              documents: [
                {
                  mimetype: MIME_TYPE_JPEG,
                  size: config.fileUpload.pins.maxFileSize + 1,
                },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title: 'valid file - pass',
        given: () => ({
          body: {
            files: {
              documents: [
                {
                  mimetype: MIME_TYPE_JPEG,
                  name: 'mock-file',
                  size: config.fileUpload.pins.maxFileSize - 1,
                },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, rules());
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
