const CrossBlob = require('cross-blob');
const validateMimeBinaryType = require('../../../../src/validators/custom/mime-binary-type');

function MockFile() {}

MockFile.prototype.create = function (name, size, mimeType, filePath) {
  function range(count) {
    let output = '';
    for (let i = 0; i < count; i += 1) {
      output += 'a';
    }
    return output;
  }

  const blobStream = new CrossBlob([range(size)], { type: mimeType });
  blobStream.name = name;
  blobStream.mimetype = mimeType;
  blobStream.tempFilePath = filePath;

  return blobStream;
};

// mock file test harness
describe('Mock file for file upload testing', function () {
  it('should be valid when given a smaller file size than the configured maximum', async () => {
    const mock = new MockFile();
    const file = mock.create(
      'example.jpeg',
      1024,
      'image/jpeg',
      `${__dirname}/../../../fixtures/file_example.jpeg`
    );
    expect(
      await validateMimeBinaryType(
        file,
        ['image/jpeg'],
        'Doc is is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      )
    ).toBeTruthy();
  });
});
