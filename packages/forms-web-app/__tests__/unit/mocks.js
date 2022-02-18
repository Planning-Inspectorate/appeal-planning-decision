jest.mock('../../src/lib/logger');

const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');

const mockReq = (appeal = householderAppeal) => ({
  cookies: {},
  log: {},
  params: {},
  session: {
    appeal,
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
