const pinsYup = require('../../lib/pins-yup');
const document = require('./document');

const multiDocument = () => {
  return pinsYup
    .object()
    .shape({ uploadedFiles: pinsYup.array().of(document()) })
    .noUnknown(true);
};

module.exports = multiDocument;
