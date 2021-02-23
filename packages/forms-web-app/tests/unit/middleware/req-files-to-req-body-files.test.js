const { mockReq, mockRes } = require('../mocks');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');

describe('middleware/req-files-to-req-body-files', () => {
  let filesPropertyPath;

  beforeEach(() => {
    filesPropertyPath = 'example-files-property-path';
  });

  [
    {
      description: 'should return early if `req.body` is not set',
      given: () => mockReq(),
      expected: (req, res, next) => {
        expect(req.body).toBe(undefined);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should return early if `req.files` is not set',
      given: () => ({
        ...mockReq(),
        body: {},
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toBe(undefined);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description:
        'should set `req.body.files = []` if unable to find the given file property path `req.files` - unset',
      given: () => ({
        ...mockReq(),
        body: {},
        files: {},
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toEqual([]);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description:
        'should set `req.body.files = []` if unable to find the given file property path `req.files` - wrong path',
      given: () => ({
        ...mockReq(),
        body: {},
        files: {
          'some-different-path': {
            x: 'y',
          },
        },
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toEqual([]);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should set `req.body.files = [req.files]` when given a single file',
      given: () => ({
        ...mockReq(),
        body: {},
        files: {
          [filesPropertyPath]: {
            a: 'b',
          },
        },
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toEqual({ [filesPropertyPath]: [{ a: 'b' }] });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should set `req.body.files = [...req.files]` when given multiple files',
      given: () => ({
        ...mockReq(),
        body: {},
        files: {
          [filesPropertyPath]: [
            {
              a: 'b',
            },
            {
              c: 'd',
            },
          ],
        },
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toEqual({
          [filesPropertyPath]: [
            {
              a: 'b',
            },
            {
              c: 'd',
            },
          ],
        });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should retain existing req.body.files when working with a different key',
      given: () => ({
        ...mockReq(),
        body: {
          files: {
            'an-existing-key-value-pair': [
              {
                rgb: 'xyz',
              },
            ],
          },
        },
        files: {
          [filesPropertyPath]: [
            {
              a: 'b',
            },
            {
              c: 'd',
            },
          ],
        },
      }),
      expected: (req, res, next) => {
        expect(req.body.files).toEqual({
          'an-existing-key-value-pair': [
            {
              rgb: 'xyz',
            },
          ],
          [filesPropertyPath]: [
            {
              a: 'b',
            },
            {
              c: 'd',
            },
          ],
        });
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ description, given, expected }) => {
    it(description, () => {
      const next = jest.fn();
      const req = given();

      reqFilesToReqBodyFilesMiddleware(filesPropertyPath)(req, mockRes(), next);

      expected(req, mockRes(), next);
    });
  });
});
