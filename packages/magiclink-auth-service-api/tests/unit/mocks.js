jest.mock('../../src/util/logger');

const logger = require('../../src/util/logger');

const mockReq = () => ({
  log: logger,
  params: {},
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
