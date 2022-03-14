const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../../src/db/db');
const app = require('../../src/app');

jest.mock('../../src/db/db');
jest.mock('../../src/lib/queue');
jest.mock('../../../common/src/lib/notify/notify-builder', () => ({}));

async function createAppeal() {
  const appeal = JSON.parse(JSON.stringify(householderAppeal));
  appeal.id = uuid.v4();
  const now = new Date(new Date().toISOString());
  appeal.appealType = '1001';
  appeal.createdAt = now;
  appeal.updatedAt = now;
  delete appeal.eligibility.applicationCategories;
  delete appeal.sectionStates.appealSiteSection.ownsSomeOfTheLand;
  delete appeal.sectionStates.appealSiteSection.ownsAllTheLand;
  delete appeal.sectionStates.appealSiteSection.knowsTheOwners;
  delete appeal.sectionStates.appealSiteSection.isAgriculturalHolding;
  delete appeal.sectionStates.appealSiteSection.isAgriculturalHoldingTenant;
  delete appeal.sectionStates.appealSiteSection.areOtherTenants;
  delete appeal.sectionStates.appealSiteSection.isVisibleFromRoad;
  delete appeal.sectionStates.appealSiteSection.visibleFromRoadDetails;
  delete appeal.sectionStates.appealSiteSection.hasHealthSafetyIssues;
  delete appeal.sectionStates.appealSiteSection.healthSafetyIssuesDetails;

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
  });

  test('POST /api/v1/appeals - It responds with a newly created appeal', async () => {
    const response = await request(app).post('/api/v1/appeals').send({});
    expect(response.body).toEqual({
      id: response.body.id,
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
    });
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
    expect(response.body.code).toBe(404);
    expect(response.body.errors).toContain('The appeal non-existent-id was not found');
    expect(response.statusCode).toBe(404);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an updated appeal', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.siteOwnership.ownsWholeSite = false;
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

    expect(response.body.code).toBe(404);
    expect(response.body.errors).toContain(
      'The appeal bfb8698e-13eb-4523-8767-1042fccc0cea was not found'
    );
    expect(response.statusCode).toBe(404);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal id in path must be the same as the id in the request body', async () => {
    const appeal = await createAppeal();
    const idInPath = appeal.id;
    appeal.id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const response = await request(app).put(`/api/v1/appeals/${idInPath}`).send(appeal);
    expect(response.body.code).toEqual(409);
    expect(response.body.errors).toContain(
      'The provided id in path must be the same as the appeal id in the request body'
    );
    expect(response.statusCode).toBe(409);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Cannot update appeal that is already SUBMITTED', async () => {
    const appeal = await createAppeal();
    appeal.state = 'SUBMITTED';
    appeal.aboutYouSection.yourDetails.name = 'Some Name';
    appeal.aboutYouSection.yourDetails.email = 'something@email.com';
    appeal.aboutYouSection.yourDetails.isOriginalApplicant = true;
    appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
    appeal.sectionStates.requiredDocumentsSection.applicationNumber = 'COMPLETED';
    appeal.sectionStates.requiredDocumentsSection.originalApplication = 'COMPLETED';
    appeal.sectionStates.requiredDocumentsSection.decisionLetter = 'COMPLETED';
    appeal.sectionStates.yourAppealSection.appealStatement = 'COMPLETED';
    appeal.sectionStates.appealSiteSection.siteAccess = 'COMPLETED';
    appeal.sectionStates.appealSiteSection.siteOwnership = 'COMPLETED';
    appeal.sectionStates.appealSiteSection.healthAndSafety = 'COMPLETED';
    appeal.sectionStates.appealSiteSection.siteAddress = 'COMPLETED';
    appeal.appealSiteSection.siteOwnership.ownsWholeSite = false;
    await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.errors).toContain('Cannot update appeal that is already SUBMITTED');
    expect(response.statusCode).toBe(409);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an updated appeal', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.siteOwnership.ownsWholeSite = false;
    const response = await request(app).patch(`/api/v1/appeals/${appeal.id}`).send(appeal);
    appeal.createdAt = response.body.createdAt;
    appeal.updatedAt = response.body.updatedAt;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(200);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an error - Not Found', async () => {
    const appeal = await createAppeal();
    appeal.id = 'bfb8698e-13eb-4523-8767-1042fccc0cea';
    const response = await request(app)
      .patch(`/api/v1/appeals/bfb8698e-13eb-4523-8767-1042fccc0cea`)
      .send(appeal);
    expect(response.body.code).toEqual(404);
    expect(response.body.errors).toContain(
      'The appeal bfb8698e-13eb-4523-8767-1042fccc0cea was not found'
    );
    expect(response.statusCode).toBe(404);
  });

  test('PATCH /api/v1/appeals/{id} - It responds with an error - appeal id in path must be the same as the id in the request body', async () => {
    const appeal = await createAppeal();
    const idInPath = appeal.id;
    appeal.id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const response = await request(app).patch(`/api/v1/appeals/${idInPath}`).send(appeal);
    expect(response.body.code).toEqual(409);
    expect(response.body.errors).toContain(
      'The provided id in path must be the same as the appeal id in the request body'
    );
    expect(response.statusCode).toBe(409);
  });
});
