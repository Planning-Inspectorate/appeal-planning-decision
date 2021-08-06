const document = require('./document');

describe('schemas/components/document', () => {
  const config = {};

  let data;

  beforeEach(() => {
    data = {
      name: 'test-pdf.pdf',
      originalFileName: 'test-pdf.pdf',
      id: '50b9d223-84c9-4b87-a8ed-5ab1b0ab42d0',
    };
  });

  it('should handle valid data', async () => {
    const result = await document().validate(data, config);
    expect(result).toEqual(data);
  });

  describe('name', () => {
    it('should throw an error when given a value with more than 255 characters', async () => {
      data.name = 'a'.repeat(256);

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('name must be at most 255 characters');
      }
    });

    it('should throw an error when a null value is given', async () => {
      data.name = null;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('name is a required field');
      }
    });

    it('should throw an error when a value is not given', async () => {
      delete data.name;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('name is a required field');
      }
    });
  });

  describe('originalFileName', () => {
    it('should throw an error when given a value with more than 255 characters', async () => {
      data.originalFileName = 'a'.repeat(256);

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('originalFileName must be at most 255 characters');
      }
    });

    it('should throw an error when a null value is given', async () => {
      data.originalFileName = null;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('originalFileName is a required field');
      }
    });

    it('should throw an error when a value is not given', async () => {
      delete data.originalFileName;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('originalFileName is a required field');
      }
    });
  });

  describe('id', () => {
    it('should throw an error when not given a UUID', async () => {
      data.id = '123';

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('id must be a valid UUID');
      }
    });

    it('should throw an error when given a null value', async () => {
      data.id = null;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain(
          'id must be a `string` type, but the final value was: `null`',
        );
      }
    });

    it('should throw an error when a value is not given', async () => {
      delete data.id;

      try {
        await document().validate(data, config);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toContain('id is a required field');
      }
    });
  });
});
