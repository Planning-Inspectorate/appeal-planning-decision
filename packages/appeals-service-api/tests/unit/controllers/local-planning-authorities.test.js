jest.mock('../../../src/schemas/lpa');

const LPA = require('../../../src/schemas/lpa');
const lpas = require('../../../src/controllers/local-planning-authorities');

let req;
let res;
describe('LPAs controller test', () => {
  beforeEach(() => {
    req = {
      log: {
        info: jest.fn(),
        debug: jest.fn(),
        trace: jest.fn(),
      },
      params: {},
      query: {},
    };
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    res.status.mockReturnValue(res);
  });

  describe('#get', () => {
    it('should trigger next if there is no LPA found', async () => {
      const id = 'someInvalidId';
      req.params = {
        id,
      };

      LPA.find.mockResolvedValue();

      const next = jest.fn();

      await lpas.get(req, res, next);

      expect(LPA.findOne).toBeCalledWith({
        id: new RegExp(id, 'i'),
      });

      expect(res.send).not.toBeCalled();
      expect(next).toBeCalledWith();
    });

    it('should return the LPA if one found', async () => {
      const id = 'someValidId';
      const target = 'some-data';
      req.params = {
        id,
      };

      LPA.findOne.mockResolvedValue(target);

      await lpas.get(req, res);

      expect(LPA.findOne).toBeCalledWith({
        id: new RegExp(id, 'i'),
      });

      expect(res.send).toBeCalledWith(target);
    });
  });

  describe('#list', () => {
    it('should return all LPAs sorted if no filter applied', async () => {
      const data = ['some-array'];
      LPA.find.mockResolvedValue(data);

      await lpas.list(req, res);

      expect(LPA.find).toBeCalledWith({});

      expect(res.send).toBeCalledWith({
        data,
        page: 1,
        limit: data.length,
        totalPages: 1,
        totalResult: data.length,
      });
    });

    it('should return filtered LPAs if filter applied', async () => {
      const filter = 'some-filter';
      req.query = {
        name: filter,
      };
      const data = ['some-filtered-array'];
      LPA.find.mockResolvedValue(data);

      await lpas.list(req, res);

      expect(LPA.find).toBeCalledWith({
        name: new RegExp(filter, 'i'),
      });

      expect(res.send).toBeCalledWith({
        data,
        page: 1,
        limit: data.length,
        totalPages: 1,
        totalResult: data.length,
      });
    });
  });
});
