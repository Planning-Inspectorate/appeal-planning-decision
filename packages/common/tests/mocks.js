jest.mock('../src/lib/logger');

const logger = require('../src/lib/logger');

const mockReq = () => ({
  cookies: {},
  log: logger,
  params: {},
  session: {
    appeal: {},
  },
});

const mockRes = () => ({
  clearCookie: jest.fn(),
  cookie: jest.fn(),
  locals: jest.fn(),
  redirect: jest.fn(),
  render: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn(),
});

module.exports = {
  mockReq,
  mockRes,
};
