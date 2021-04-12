const { checkSchema } = require('express-validator');
const fileSchema = require('./schemas/files');

const rules = () => {
  return [checkSchema(fileSchema)];
};

module.exports = rules;
