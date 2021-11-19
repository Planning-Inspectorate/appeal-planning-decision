const get = jest.fn();
const post = jest.fn();
const use = jest.fn();
const serve = jest.fn();
const setup = jest.fn();

jest.doMock('express', () => ({
  Router: () => ({
    get,
    post,
    use,
  }),
}));

jest.doMock('swagger-ui-express', () => ({
  serve,
  setup,
}));

module.exports = {
  get,
  post,
  use,
  serve,
  setup,
};
