jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');
const emptyAppealReply = require('../../src/lib/empty-appeal-reply');

const mockReq = (appealReply = emptyAppealReply, id = 'mock-id') => ({
  log: logger,
  params: {
    id,
  },
  session: {
    appealReply,
  },
});

const mockRes = () => {
  const res = {};
  res.redirect = jest.fn();
  res.render = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
