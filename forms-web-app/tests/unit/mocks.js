jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');

const mockReq = () => ({
  log: logger,
  session: {},
});

const mockRes = () => {
  const res = {};
  res.redirect = jest.fn();
  res.render = jest.fn();
  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
