import Config from '../../src/config/Config';

describe('Config class', () => {
  it('Config.PORT should return default port of 4000 if process.env.APD_API_PORT not set', () => {
    expect(Config.PORT).toEqual(4000);
  });

  it('Config.PORT should return 5000 is process.env.APD_API_PORT set to 5000', () => {
    process.env.APD_API_PORT = '5000';

    expect(Config.PORT).toEqual(5000);
  });
});
