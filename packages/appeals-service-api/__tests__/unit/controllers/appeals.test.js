const { MongoClient } = require('mongodb');
const uuid = require('uuid');

const { createAppeal, getAppeal, updateAppeal } = require('../../../src/controllers/appeals');
const { appealDocument } = require('../../../src/models/appeal');
const mongodb = require('../../../src/db/db');

jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/logger');
const valueAppeal = require('../value-appeal');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));

async function addInDatabase() {
  const appeal = JSON.parse(JSON.stringify(appealDocument));

  appeal.id = uuid.v4();
  const now = new Date(new Date().toISOString());
  appeal.createdAt = now;
  appeal.updatedAt = now;
  delete appeal.eligibility.applicationCategories;
  delete appeal.sectionStates.appealSiteSection.ownsSomeOfTheLand;

  await mongodb.get().collection('appeals').insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
  return appeal;
}

async function getFromDatabase(appealId) {
  return mongodb.get().collection('appeals').findOne({ _id: appealId });
}

describe('appeals.controllers', () => {
  let req;
  let res;
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    mongodb.get.mockReturnValue(db);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAppeal', () => {
    it('should respond with an existing appeal - OK 200', async () => {
      const appeal = await addInDatabase();
      const appealId = appeal.id;

      req.params.id = appealId;

      await getAppeal(req, res);
      expect(res.send).toHaveBeenCalledWith(appeal);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should respond with an error - 404 Not Found', async () => {
      req.params.id = 'non-existent-id';

      await getAppeal(req, res);
      expect(res.send).toHaveBeenCalledWith({
        code: 404,
        errors: ['The appeal non-existent-id was not found'],
      });
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createAppeal', () => {
    it('responds with a newly created appeal', async () => {
      await createAppeal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateAppeal', () => {
    it('responds with an error - Not Found', async () => {
      req.params.id = 'non-existent-id';

      await updateAppeal(req, res);
      expect(res.send).toHaveBeenCalledWith({
        code: 404,
        errors: ['The appeal non-existent-id was not found'],
      });
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('responds with an updated appeal', async () => {
      const appeal = await addInDatabase();
      const appealId = appeal.id;
      valueAppeal(appeal);

      req.params.id = appealId;
      req.body = appeal;

      await updateAppeal(req, res);

      const updatedAppeal = await getFromDatabase(appealId);

      appeal.updatedAt = updatedAppeal.appeal.updatedAt;
      expect(appeal).toEqual(updatedAppeal.appeal);

      expect(res.send).toHaveBeenCalledWith(appeal);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('it responds with a updated appeal', async () => {
      const appeal = await addInDatabase();
      const appealId = appeal.id;

      expect(appeal.horizonId).toBeNull();

      req.params.id = appealId;
      req.body.horizonId = 'horizonId';

      await updateAppeal(req, res);

      const updatedAppeal = await getFromDatabase(appealId);

      appeal.horizonId = 'horizonId';
      appeal.updatedAt = updatedAppeal.appeal.updatedAt;
      expect(appeal).toEqual(updatedAppeal.appeal);

      expect(res.send).toHaveBeenCalledWith(appeal);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
