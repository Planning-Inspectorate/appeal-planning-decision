const mockReq = () => {
  const req = {};
  return req;
};

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
