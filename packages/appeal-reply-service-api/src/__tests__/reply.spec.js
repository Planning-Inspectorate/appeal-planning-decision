const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../db/db');
const app = require('../app');
const { blankModel } = require('../models/blankModel');

jest.mock('../db/db');
const endpoint = '/api/v1/reply';
const dbId = 'reply';

async function createReply() {
  const reply = JSON.parse(JSON.stringify(blankModel));

  reply.id = uuid.v4();
  await mongodb.get().collection(dbId).insertOne({ _id: reply.id, uuid: reply.id, reply });
  return reply;
}

describe('Replies API', () => {
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

  test('POST /api/v1/reply - It responds with a newly created reply', async () => {
    const parsedReplyModel = JSON.parse(JSON.stringify(blankModel));
    parsedReplyModel.appealId = '1'; // TODO: UUID Structure. Will fail when properly validated
    const response = await request(app).post(endpoint).send({ appealId: '1' });
    parsedReplyModel.id = response.body.id;
    expect(response.body).toEqual(parsedReplyModel);
    expect(response.statusCode).toBe(201);
  });

  test('POST /api/v1/reply - It responds with an error - Blank appealId', async () => {
    const response = await request(app).post(endpoint).send({ appealId: '' });
    expect(response.statusCode).toBe(400);
  });

  test('POST /api/v1/reply - It responds with an error - Undefined appealId', async () => {
    const response = await request(app).post(endpoint).send({});
    expect(response.statusCode).toBe(400);
  });

  test('GET /api/v1/reply/{id} - It responds with an existing reply', async () => {
    const reply = await createReply();
    const response = await request(app).get(`${endpoint}/${reply.id}`);
    expect(response.body).toEqual(reply);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/reply/{id} - It responds with an error - Not Found', async () => {
    const response = await request(app).get(`${endpoint}/non-existent-id`);
    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(404);
  });

  test('PUT /api/v1/reply/{id} - It responds with status 200 and matching reply', async () => {
    const reply = { id: uuid.v4() };
    await mongodb.get().collection(dbId).insertOne({ _id: reply.id, uuid: reply.id, reply });

    reply.updated = true;
    const response = await request(app).put(`/api/v1/reply/${reply.id}`).send(reply);
    expect(response.body).toEqual(reply);
    expect(response.statusCode).toBe(200);
  });
});
