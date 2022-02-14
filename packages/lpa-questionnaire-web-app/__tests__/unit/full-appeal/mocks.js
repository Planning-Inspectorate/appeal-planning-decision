jest.mock('../../../src/lib/logger');

const logger = require('../../../src/lib/logger');
const emptyAppealReply = require('./emptyAppealReply');
const mockAppeal = require('./mockAppeal');

const mockReq = (appealReply = emptyAppealReply, appeal = mockAppeal, id = 'mock-id') => ({
  log: logger,
  params: {
    id,
  },
  session: {
    appealReply,
    appeal,
  },
  get: jest.fn(),
});

const mockRes = () => {
  const res = {};
  res.locals = {};
  res.redirect = jest.fn();
  res.render = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
