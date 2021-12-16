jest.mock('clamscan')
const NodeClam = require('clamscan');

const clamd = require('../../../src/lib/clamd');
const fs = require("fs");

describe('lib/clamd', () => {

  beforeEach(() => {
  })

  it("should send invalid file", async () => {
    await expect(() => clamd.sendFile(undefined).rejects.toThrowError(
      'invalid or empty file'
    ))
  })

  it("should send variable that's not a buffer", async () => {
    await expect(() => clamd.sendFile("hello").rejects.toThrowError(
      'invalid file type, requires a buffer'
    ))
  })


  /*
  it("should send valid file", async () => {
    const fileBuffer = fs.readFileSync("__tests__/fixtures/eicar.com.txt");
    jest.spyOn('clamscan')

    const clamscan = {
      init: jest.fn(),
      scanStream: jest.fn(() => 100)
    }

    new NodeClam.mockReturnValue(() => clamscan)

    // const clamscan = await new NodeClam().init();
    // clamscan.scanStream.mockResolvedValue({ file: "", isInfected: true, viruses: [] })
  
    const result = await clamd.sendFile(fileBuffer);
    expect(result.isInfected).toEqual(true);
  })*/

});
