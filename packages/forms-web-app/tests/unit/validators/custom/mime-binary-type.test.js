const validateMimeBinaryType = require('../../../../src/validators/custom/mime-binary-type');
const blob = require("cross-blob");
const fs = require('fs');

function MockFile() { };

MockFile.prototype.create = function (name, size, mimeType) {
  name = name || "mock.txt";
  size = size || 1024;
  mimeType = mimeType || 'plain/txt';

  function range(count) {
    var output = "";
    for (var i = 0; i < count; i++) {
      output += "a";
    }
    return output;
  }

  const blob1 = new blob([range(size)], { type: mimeType });
  blob1.lastModifiedDate = new Date();
  blob1.name = name;
  blob1.tempFilePath = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAAC';
  blob1.mimetype = mimeType;
  return blob1;
};



// // mock file test harness
// describe("Mock file for file upload testing", function () {
//   it("should be defined", function() {
//     var file = new MockFile();
//     expect(file).not.toBeNull();
//   });
//
//   it("should have default values", function() {
//     var mock = new MockFile();
//     var file = mock.create();
//     expect(file.name).toBe('mock1.txt');
//     expect(file.size).toBe(1024);
//   });
//
//   it("should have specific values", function () {
//     var size = 1024 * 1024 * 2;
//     var mock = new MockFile();
//     var file = mock.create("pic.jpg", size, "image/jpeg");
//     expect(file.name).toBe('pic.jpg');
//     expect(file.size).toBe(size);
//     expect(file.type).toBe('image/jpeg');
//   });
// });
//

// mock file test harness
describe('Mock file for file upload testing', function () {

  it('should be valid when given a smaller file size than the configured maximum', () => {
    var size = 1024 * 1024 * 2;
    var mock = new MockFile();
    var file = mock.create("pic.png", size, "image/png");
    expect(validateMimeBinaryType(file,[
        'image/doc'
      ],
      'Doc is is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG')).rejects.toBeTruthy();
  });


  // describe('validators/custom/mime-binary-type', () => {
  //   it('should be valid', () => {
  //     const mimes = ['a', 'b', 'c'];
  //
  //     mimes.forEach((mime) => expect(validateMimeType(mime, mimes)).toBeTruthy());
  //   });
  //
  //   [
  //     {
  //       givenMimeType: 'x',
  //       allowableMimeTypes: ['y'],
  //       errorMessage: 'Doc is the wrong file type: The file must be a Something, or Something',
  //     },
  //     {
  //       givenMimeType: 'x',
  //       allowableMimeTypes: ['y', 'z'],
  //       errorMessage: 'Doc is the wrong file type: The file must be a Something, or Something',
  //     },
  //     {
  //       givenMimeType: 'x',
  //       allowableMimeTypes: ['y', 'z', 'qqq'],
  //       errorMessage: 'Can be anything - exact words are not important',
  //     },
  //   ].forEach(({ givenMimeType, allowableMimeTypes, errorMessage }) => {
  //     it('should throw', () => {
  //       expect(() => validateMimeType(givenMimeType, allowableMimeTypes, errorMessage)).toThrow(
  //         errorMessage
  //       );
  //     });
  //   });
});
