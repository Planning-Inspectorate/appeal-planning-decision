const { checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');

const rules = () => {
  return [checkSchema(fileUploadSchema)];
};

module.exports = {
  rules,
};
