jest.mock('../../src/lib/logger');
const logger = require('../../src/lib/logger');

const mockReq = () => ({
  log: logger,
  params: {},
  body: {},
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn();
  res.send = jest.fn();
  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);

  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
