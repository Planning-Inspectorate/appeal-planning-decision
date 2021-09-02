const logger = require('../../src/lib/logger');

jest.mock('../../src/lib/logger');

const mockReq = () => ({
  log: logger,
  params: {},
  body: {},
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
