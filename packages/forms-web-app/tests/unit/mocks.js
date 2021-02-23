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

const mockRes = () => ({
  redirect: jest.fn(),
  render: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn(),
});

module.exports = {
  mockReq,
  mockRes,
};
