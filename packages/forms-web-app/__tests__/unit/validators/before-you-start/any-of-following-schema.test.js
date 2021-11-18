const schema = require('../../../../src/validators/before-you-start/any-of-following-schema');

describe('validators/before-you-start/any-of-following-schema', () => {
  it('has a defined custom schema object', () => {
    expect(schema['any-of-following'].custom.options).toBeDefined();
  });

  describe(`schema['any-of-following'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['any-of-following'].custom.options;
    });

    it('should return true if `req.body.option` is a string', () => {
      expect(
        fn('some value', {
          req: {
            body: {
              option: 'none_of_above',
            },
          },
        })
      ).toBeTruthy();
    });

    it('should return true if `req.body.option` is a array', () => {
      expect(
        fn('some value', {
          req: {
            body: {
              option: ['none_of_these', 'major_retail_and_services'],
            },
          },
        })
      ).toBeTruthy();
    });
  });
});
