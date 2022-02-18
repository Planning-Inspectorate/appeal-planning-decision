const { APPLICATION_DECISION } = require('../../../constants');

/**
 * @description Determine if a given application type (applicationDecision) is valid.
 *
 * @param {string} applicationDecision
 * @returns {boolean}
 */
module.exports = (applicationDecision) => {
  return Object.values(APPLICATION_DECISION).includes(applicationDecision);
};
