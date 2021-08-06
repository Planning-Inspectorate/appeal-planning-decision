const pinsYup = require('../../../lib/pins-yup');
const document = require('./document');

const singleDocument = () => {
  return pinsYup.object().shape({ uploadedFile: document() }).noUnknown(true);
};

module.exports = singleDocument;
