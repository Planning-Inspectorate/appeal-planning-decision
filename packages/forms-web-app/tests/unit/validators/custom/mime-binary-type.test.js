const blob = require('cross-blob');
const fs = require('fs');
const validateMimeBinaryType = require('../../../../src/validators/custom/mime-binary-type');

function MockFile() {}

MockFile.prototype.create = function (name, size, mimeType) {
  name = name || 'mock.txt';
  size = size || 1024;
  mimeType = mimeType || 'plain/txt';

  function range(count) {
    let output = '';
    for (let i = 0; i < count; i++) {
      output += 'a';
    }
    return output;
  }

  const blob1 = new blob([range(size)], { type: mimeType });
  blob1.lastModifiedDate = new Date();
  blob1.name = name;
  blob1.tempFilePath = `${__dirname}/../../../fixtures/file_example.jpeg`;
  //blob1.tempFilePath = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAAC';
  blob1.mimetype = mimeType;
  return blob1;
};

// mock file test harness
describe('Mock file for file upload testing', function () {
  it('should be valid when given a smaller file size than the configured maximum', async () => {
    const size = 1024 * 1024 * 2;
    const mock = new MockFile();
    const file = mock.create('pic.png', size, 'image/jpeg');
    expect(
      await validateMimeBinaryType(
        file,
        ['image/jpeg'],
        'Doc is is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      )
    ).toBeTruthy();
  });
});
