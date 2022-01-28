const createYupError = require('../../utils/create-yup-error');

function conditionalTextField({
  fieldValue,
  fieldName,
  targetFieldName,
  emptyError,
  tooLongError,
  targetFieldValue = false,
  maxLength = 255,
}) {
  return this.test(fieldName, null, function test() {
    if (this.options.parent[targetFieldName] === targetFieldValue) {
      if (!fieldValue) {
        return createYupError.call(this, emptyError);
      }

      if (fieldValue.length > maxLength) {
        return createYupError.call(this, tooLongError.replace('$maxLength', maxLength));
      }
    }
    return true;
  });
}

module.exports = conditionalTextField;
