jest.mock('../../src/lib/logger');
const logger = require('../../src/lib/logger');

const mockReq = () => ({
  log: logger,
  params: {},
  body: {},
});

const mockRes = () => {
  const res = {};
  res.json = jest.fn();
  res.status = jest.fn();
  res.send = jest.fn();
  res.json.mockReturnValue(res);
  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);

  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
