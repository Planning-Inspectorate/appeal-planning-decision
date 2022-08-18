const SchemaModel = require('../schema-model');
const appealValidationSchema = require('./appeal-schema');

SchemaModel.setValidationAction('insert');
const insert = appealValidationSchema();

module.exports = insert;
