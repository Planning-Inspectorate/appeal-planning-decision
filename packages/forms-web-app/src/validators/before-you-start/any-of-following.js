const { body, checkSchema } = require('express-validator');
const anyOfFollowingSchema = require('./any-of-following-schema');

const rules = () => {
  return [checkSchema(anyOfFollowingSchema), body('option').notEmpty()];
};

module.exports = {
  rules,
};
