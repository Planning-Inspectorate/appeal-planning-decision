const { connect, get, close } = require('../../src/db/db');

describe('db/db', () => {
  describe('connect', () => {
    it('should connect to mongodb', async () => {
      await connect(() => jest.fn());
    });
  });

  describe('get', () => {
    it('should get a mongodb connection', async () => {
      await get();
    });
  });

  describe('close', () => {
    it('should close the mongodb connection', async () => {
      await close();
    });
  });
});
