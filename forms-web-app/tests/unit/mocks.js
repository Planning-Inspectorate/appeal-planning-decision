jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../src/lib/empty-appeal');

const { empty: emptyAppeal } = APPEAL_DOCUMENT;

const mockReq = (appeal = emptyAppeal) => ({
  log: logger,
  session: {
    appeal,
  },
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
