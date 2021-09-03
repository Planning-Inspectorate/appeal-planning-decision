const get = jest.fn();
const post = jest.fn();
const put = jest.fn();
const patch = jest.fn();
const use = jest.fn();
jest.doMock('express', () => ({
  Router: () => ({
    get,
    post,
    patch,
    put,
    use,
  }),
}));

module.exports = {
  get,
  post,
  put,
  patch,
  use,
};
