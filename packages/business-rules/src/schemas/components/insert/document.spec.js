const document = require('./document');

describe('schemas/components/insert/document', () => {
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

    it('should not throw an error when not given a value', async () => {
      delete data.name;

      const result = await document().validate(data, config);
      expect(result).toEqual({
        ...data,
        name: '',
      });
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

    it('should not throw an error when not given a value', async () => {
      delete data.originalFileName;

      const result = await document().validate(data, config);
      expect(result).toEqual({
        ...data,
        originalFileName: '',
      });
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

    it('should not throw an error when not given a value', async () => {
      delete data.id;

      const result = await document().validate(data, config);
      expect(result).toEqual({
        ...data,
        id: null,
      });
    });
  });
});
