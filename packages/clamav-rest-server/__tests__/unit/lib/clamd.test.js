const clamd = require('../../../src/lib/clamd');

describe('lib/clamd', () => {
  beforeEach(() => {});

  it('should send invalid file', async () => {
    await expect(() => clamd.sendFile(undefined).rejects.toThrowError('invalid or empty file'));
  });

  it("should send variable that's not a buffer", async () => {
    await expect(() =>
      clamd.sendFile('hello').rejects.toThrowError('invalid file type, requires a buffer')
    );
  });

  it('should send valid file with valid input', async () => {
    const fileBuffer = Buffer.from([]);

    const result = await clamd.sendFile(fileBuffer);
    expect(result.isInfected).toBeDefined();
  });
});
