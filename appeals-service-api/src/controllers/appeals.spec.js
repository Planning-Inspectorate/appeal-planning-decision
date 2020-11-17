jest.mock('../schemas/appeals');

const appeals = require('./appeals');
const AppealsSchema = require('../schemas/appeals');

let req;
let res;
describe('appeals controller test', () => {
  beforeEach(() => {
    AppealsSchema.mockClear();

    req = {
      body: {},
      log: {
        debug: jest.fn(),
        info: jest.fn(),
      },
      param: jest.fn(),
    };
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    res.status.mockReturnValue(res);
  });

  describe('#create', () => {
    it('should handle a validation error to return a 400 error', async () => {
      const err = new Error('some-error');
      AppealsSchema.prototype.validate.mockRejectedValue(err);

      expect(await appeals.create(req, res)).toBeUndefined();

      const inst = AppealsSchema.mock.instances[0];

      expect(inst.generateUUID).toBeCalledWith();
      expect(inst.save).not.toBeCalledWith();

      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith(err);
    });

    it('should pass validation and save the model', async () => {
      AppealsSchema.prototype.validate.mockResolvedValue();

      expect(await appeals.create(req, res)).toBeUndefined();

      const inst = AppealsSchema.mock.instances[0];

      expect(inst.generateUUID).toBeCalledWith();
      expect(inst.save).toBeCalledWith();

      expect(res.send).toBeCalledWith(inst);
    });
  });

  describe('#delete', () => {
    it('should delete an appeal by the uuid', async () => {
      const uuid = 'my-uuid';
      req.param.mockReturnValueOnce(uuid);

      expect(await appeals.delete(req, res)).toBeUndefined();

      expect(AppealsSchema.deleteOne).toBeCalledWith({
        uuid,
      });

      expect(res.status).toBeCalledWith(204);
      expect(res.send).toBeCalledWith();
    });
  });

  describe('#get', () => {
    it('should return 404 if no appeal found', async () => {
      const uuid = 'missing-uuid';
      req.param.mockReturnValueOnce(uuid);

      AppealsSchema.findOne.mockResolvedValue();

      expect(await appeals.get(req, res)).toBeUndefined();

      expect(AppealsSchema.findOne).toBeCalledWith({
        uuid,
      });

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith();
    });

    it('should return the appeal if found', async () => {
      const uuid = 'found-uuid';
      req.param.mockReturnValueOnce(uuid);
      const appeal = {
        uuid,
        some: 'appeal',
      };

      AppealsSchema.findOne.mockResolvedValue(appeal);

      expect(await appeals.get(req, res)).toBeUndefined();

      expect(AppealsSchema.findOne).toBeCalledWith({
        uuid,
      });

      expect(res.send).toBeCalledWith(appeal);
    });
  });

  describe('#list', () => {
    it('should call the find method with no arguments and return no data', async () => {
      const data = [];
      AppealsSchema.find.mockResolvedValue(data);

      expect(await appeals.list(req, res)).toBeUndefined();

      expect(res.send).toBeCalledWith({
        data,
        page: 1,
        limit: data.length,
        totalPages: 1,
        totalResult: data.length,
      });
    });

    it('should call the find method with no arguments and return multiple objects', async () => {
      const data = [
        {
          text: 'item 1',
        },
        {
          text: 'item2',
        },
      ];
      AppealsSchema.find.mockResolvedValue(data);

      expect(await appeals.list(req, res)).toBeUndefined();

      expect(res.send).toBeCalledWith({
        data,
        page: 1,
        limit: data.length,
        totalPages: 1,
        totalResult: data.length,
      });
    });
  });

  describe('#update', () => {
    it('should return 404 if no appeal found', async () => {
      const uuid = 'missing-uuid';
      req.param.mockReturnValueOnce(uuid);
      req.body = 'some-input';

      AppealsSchema.updateOne.mockResolvedValue({
        n: 0,
      });

      expect(await appeals.update(req, res)).toBeUndefined();

      expect(AppealsSchema.updateOne).toBeCalledWith(
        {
          uuid,
        },
        req.body,
        {
          runValidators: true,
        }
      );

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith();
    });

    it('should update and return the appeal if found', async () => {
      const uuid = 'valid-uuid';
      req.param.mockReturnValueOnce(uuid);
      req.body = 'some-input';

      AppealsSchema.updateOne.mockResolvedValue({
        n: 1,
      });

      const appeal = {
        uuid,
        some: 'appeal',
      };

      AppealsSchema.findOne.mockResolvedValue(appeal);

      expect(await appeals.update(req, res)).toBeUndefined();

      expect(AppealsSchema.findOne).toBeCalledWith({
        uuid,
      });

      expect(AppealsSchema.updateOne).toBeCalledWith(
        {
          uuid,
        },
        req.body,
        {
          runValidators: true,
        }
      );

      expect(res.send).toBeCalledWith(appeal);
    });
  });
});
