const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../../src/db/db');
const app = require('../../src/app');
const { appealDocument } = require('../../src/models/appeal');

const valueAppeal = require('../unit/value-appeal');

jest.mock('../../src/db/db');
jest.mock('../../src/lib/queue');
jest.mock('../../../common/src/lib/notify/notify-builder', () => ({}));

async function createAppeal() {
  const appeal = JSON.parse(JSON.stringify(appealDocument));
  appeal.id = uuid.v4();
  const now = new Date(new Date().toISOString());
  appeal.createdAt = now;
  appeal.updatedAt = now;

  await mongodb.get().collection('appeals').insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
  return appeal;
}

describe('Appeals API', () => {
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

  test('aaaaaaaaaaaaa', async () => {
    const appeal = JSON.parse(JSON.stringify(appealDocument));
    const postAppealResponse = await request(app).post('/api/v1/appeals').send({});
    appeal.id = postAppealResponse.body.id;
    appeal.decisionDate = '2020-04-10T12:00:00.000Z';

    console.log(`appeal`, appeal);

    const updatedAppealResponse = await request(app)
      .put(`/api/v1/appeals/${appeal.id}`)
      .send(appeal);
    expect(updatedAppealResponse.body.errors).toBeDefined();
    expect(updatedAppealResponse.body.errors).toContain(
      'Cannot update appeal that is already SUBMITTED'
    );
    expect(updatedAppealResponse.statusCode).toBe(409);
  });
});
