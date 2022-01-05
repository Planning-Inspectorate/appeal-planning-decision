const { checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');

const rules = (noFilesError) => {
  return [checkSchema(fileUploadSchema(noFilesError))];
};

module.exports = {
  rules,
};
