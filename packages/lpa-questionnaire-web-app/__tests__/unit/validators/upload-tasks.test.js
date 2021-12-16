const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const rules = require('../../../src/validators/upload-tasks');
const { MIME_TYPE_JPEG } = require('../../../src/lib/file-upload-helpers');
const config = require('../../../src/config');

describe('validators/upload-plans', () => {
  describe('rules', () => {
    it('has a rule for `files.documents.*`', () => {
      const rule = rules()[0][0].builder.build();

      expect(rule.fields).toEqual(['files.documents.*']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.name).toEqual('options');
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('has a rule for no files found', () => {
      const rule = rules()[1].builder.build();
      expect(rule.fields).toEqual(['documents']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('should have the expected number of configured rules', () => {
      expect(rules().length).toEqual(2);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined / empty - fail ',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock error message');
        },
      },
      {
        title: 'files key is empty - fail',
        given: () => ({
          body: {
            files: [],
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock error message');
        },
      },
      {
        title: 'files path is not matched - fail',
        given: () => ({
          body: {
            files: {
              'something-else': [],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock error message');
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
                  name: 'mock-file',
                },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe(
            'mock-file is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG.'
          );
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
                  name: 'mock-file',
                  size: config.fileUpload.pins.maxFileSize + 1,
                },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('mock-file must be smaller than 16 MB');
        },
      },
      {
        title: 'no file but no error message passed - pass',
        given: () => ({
          given: () => ({
            body: {},
          }),
        }),
        errorMessage: null,
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
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
      {
        title: 'valid uploaded documents exist - pass',
        given: () => ({
          body: {
            tempDocs: '{ "id: mock-content" }',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected, errorMessage = 'Mock error message' }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, rules(errorMessage));
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
