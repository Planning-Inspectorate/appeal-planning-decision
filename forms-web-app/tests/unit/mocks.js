jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../src/lib/appeals-api-wrapper');

const emptyAppeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));

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
