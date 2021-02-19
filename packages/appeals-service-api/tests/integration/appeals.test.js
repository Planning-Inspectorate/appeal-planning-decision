const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../../src/db/db');
const app = require('../../src/app');
const { appealDocument } = require('../../src/models/appeal');

const valueAppeal = require('../unit/value-appeal');

jest.mock('../../src/db/db');

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

  test('POST /api/v1/appeals - It responds with a newly created appeal', async () => {
    const appeal = JSON.parse(JSON.stringify(appealDocument));
    const response = await request(app).post('/api/v1/appeals').send({});
    appeal.id = response.body.id;
    appeal.createdAt = response.body.createdAt;
    appeal.updatedAt = response.body.updatedAt;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(201);
  });

  test('GET /api/v1/appeals/{id} - It responds with an existing appeal', async () => {
    const appeal = await createAppeal();
    const response = await request(app).get(`/api/v1/appeals/${appeal.id}`);
    appeal.createdAt = response.body.createdAt;
    appeal.updatedAt = response.body.updatedAt;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/appeals/{id} - It responds with an error - Not Found', async () => {
    const response = await request(app).get(`/api/v1/appeals/non-existent-id`);
    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(404);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an updated appeal', async () => {
    const appeal = await createAppeal();
    valueAppeal(appeal);
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    appeal.createdAt = response.body.createdAt;
    appeal.updatedAt = response.body.updatedAt;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(200);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Not Found', async () => {
    const appeal = await createAppeal();
    appeal.id = 'bfb8698e-13eb-4523-8767-1042fccc0cea';
    const response = await request(app)
      .put(`/api/v1/appeals/bfb8698e-13eb-4523-8767-1042fccc0cea`)
      .send(appeal);
    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(404);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal id in path must be the same as the id in the request body', async () => {
    const appeal = await createAppeal();
    const idInPath = appeal.id;
    appeal.id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const response = await request(app).put(`/api/v1/appeals/${idInPath}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The provided id in path must be the same as the appeal id in the request body'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an updated appeal', async () => {
    const appeal = await createAppeal();
    valueAppeal(appeal);
    const response = await request(app).patch(`/api/v1/appeals/${appeal.id}`).send(appeal);
    appeal.createdAt = response.body.createdAt;
    appeal.updatedAt = response.body.updatedAt;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(200);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an error - Not Found', async () => {
    const appeal = await createAppeal();
    valueAppeal(appeal);
    appeal.id = 'bfb8698e-13eb-4523-8767-1042fccc0cea';
    const response = await request(app)
      .patch(`/api/v1/appeals/bfb8698e-13eb-4523-8767-1042fccc0cea`)
      .send(appeal);
    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(404);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an error - appeal id in path must be the same as the id in the request body', async () => {
    const appeal = await createAppeal();
    valueAppeal(appeal);
    const idInPath = appeal.id;
    appeal.id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const response = await request(app).patch(`/api/v1/appeals/${idInPath}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The provided id in path must be the same as the appeal id in the request body'
    );
    expect(response.statusCode).toBe(400);
  });
});
