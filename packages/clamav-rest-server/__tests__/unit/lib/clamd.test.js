jest.mock('../../../src/lib/clamd');

const fs = require('fs');
const clamd = require('../../../src/lib/clamd');

describe('lib/clamd', () => {
  beforeEach(() => {});

  it('should send invalid file', async (done) => {
    await expect(() => clamd.sendFile(undefined).rejects.toThrowError('invalid or empty file'));
    done();
  });

  it("should send variable that's not a buffer", async (done) => {
    await expect(() =>
      clamd.sendFile('hello').rejects.toThrowError('invalid file type, requires a buffer')
    );

    done();
  });

  it('should send valid file', async () => {
    const fileBuffer = fs.readFileSync('__tests__/fixtures/eicar.com.txt');
    jest.spyOn(clamd, 'createClient');

    clamd.createClient.mockResolvedValue(() => ({
      scanStream: jest.fn(),
    }));

    clamd.sendFile.mockResolvedValue({
      isInfected: true,
    });

    const result = await clamd.sendFile(fileBuffer);
    expect(result.isInfected).toEqual(true);
  });
});
