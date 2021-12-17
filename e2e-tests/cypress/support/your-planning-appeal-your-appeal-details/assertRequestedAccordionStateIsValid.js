const STATE = require('./accordion-states');

module.exports = (given) => {
  if (!Object.values(STATE).includes(given)) {
    throw new Error(`Invalid state: ${given}, valid states are: ${Object.keys(STATE)}`);
  }
};
