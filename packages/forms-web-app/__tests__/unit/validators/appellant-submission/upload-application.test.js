const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/appellant-submission/upload-application');
const { MIME_TYPE_JPEG } = require('../../../../src/lib/mime-types');
const config = require('../../../../src/config');

describe('validators/appellant-submission/upload-application', () => {
  const appealWithFile = {
    appeal: {
      requiredDocumentsSection: { originalApplication: { uploadedFile: { id: 'planning.pdf' } } },
    },
  };

  const appealWithoutFile = {
    appeal: {
      requiredDocumentsSection: { originalApplication: { uploadedFile: { id: null } } },
    },
  };

  describe('rules', () => {
    it('has a rule for `application-upload`', () => {
      const rule = rules()[0][0].builder.build();

      expect(rule.fields).toEqual(['application-upload']);
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
        title: 'already submitted / undefined / empty - pass ',
        given: () => ({
          session: appealWithFile,
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'already submitted / files key is empty - pass',
        given: () => ({
          session: appealWithFile,
          files: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'already submitted / files path is not matched - pass',
        given: () => ({
          session: appealWithFile,
          body: {
            'application-upload': 'a',
          },
          files: { x: {} },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'never submitted / undefined / empty - fail ',
        given: () => ({
          session: appealWithoutFile,
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Select a planning application form');
        },
      },
      {
        title: 'never submitted / files key is empty - fail',
        given: () => ({
          session: appealWithoutFile,
          files: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Select a planning application form');
        },
      },
      {
        title: 'never submitted /files path is not matched - fail',
        given: () => ({
          session: appealWithoutFile,
          body: {
            'application-upload': 'a',
          },
          files: { x: {} },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Select a planning application form');
        },
      },
      {
        title: 'files path is matched but mime type is wrong - fail',
        given: () => ({
          session: appealWithoutFile,
          body: {
            'application-upload': 'x',
          },
          files: {
            'application-upload': {
              mimetype: 'bad',
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
          session: appealWithoutFile,
          body: {
            'application-upload': 'x',
          },
          files: {
            'application-upload': {
              mimetype: MIME_TYPE_JPEG,
              size: config.fileUpload.pins.uploadApplicationMaxFileSize + 1,
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
          session: appealWithoutFile,
          body: {
            'application-upload': 'x',
          },
          files: {
            'application-upload': {
              mimetype: MIME_TYPE_JPEG,
              size: config.fileUpload.pins.uploadApplicationMaxFileSize - 1,
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
