const { appealValidationSchema } = require('./appeal-schema/index');
const insert = appealValidationSchema();
module.exports = insert;
