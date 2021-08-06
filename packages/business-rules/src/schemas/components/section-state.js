const pinsYup = require('../../lib/pins-yup');
const { SECTION_STATE } = require('../../constants');

const sectionState = () => {
  return pinsYup.string().oneOf(Object.values(SECTION_STATE)).required();
};

module.exports = sectionState;
