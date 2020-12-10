const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../db/db');
const app = require('../app');
const { appealDocument } = require('../models/appeal');

jest.mock('../db/db');

async function createAppeal() {
  const appeal = appealDocument;
  appeal.id = uuid.v4();
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
    const appeal = appealDocument;
    const response = await request(app).post('/api/v1/appeals').send({
      // lpaCode: 'E60000281',
      // decisionDate,
    });
    appeal.id = response.body.id;
    expect(response.body).toEqual(appeal);
    expect(response.statusCode).toBe(201);
  });

  test('GET /api/v1/appeals/{id} - It responds with an existing appeal', async () => {
    const appeal = await createAppeal();
    const response = await request(app).get(`/api/v1/appeals/${appeal.id}`);
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
    appeal.lpaCode = 'E60000281/new';
    appeal.decisionDate = '2020-10-29';
    appeal.state = 'DRAFT';
    appeal.aboutYouSection.yourDetails = {
      isOriginalApplicant: false,
      name: 'Ms Alison Khan',
      email: 'akhan123@email.com',
      appealingOnBehalfOf: 'Mr Josh Evans',
    };
    appeal.requiredDocumentsSection.applicationNumber = 'S/35552';
    appeal.requiredDocumentsSection.originalApplication.uploadedFile = {
      name: 'my_uploaded_file_original_application.pdf',
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    };
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile = {
      name: 'my_uploaded_file_decision_letter.pdf',
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    };
    appeal.yourAppealSection.appealStatement.uploadedFile = {
      name: 'my_uploaded_file_appeal_statement.pdf',
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    };
    appeal.yourAppealSection.appealStatement.hasSensitiveInformation = false;
    appeal.yourAppealSection.otherDocuments.documents = [
      {
        uploadedFile: {
          name: 'my_uploaded_file_other_documents_one.pdf',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
      },
      {
        uploadedFile: {
          name: 'my_uploaded_fileother_documents_two.pdf',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
      },
    ];
    appeal.yourAppealSection.otherAppeals = {
      hasOtherAppeal: true,
      otherAppealRefNumber: 'E60000281/one,E60000281/two,E60000281/three',
    };
    appeal.appealSiteSection.siteAddress = {
      addressLine1: 'The Grand House',
      addressLine2: 'High Street',
      town: 'Swansea',
      county: 'Dinas a Sir Abertawe',
      postcode: 'SA21 5TY',
    };
    appeal.appealSiteSection.siteOwnership = {
      ownsWholeSite: false,
      haveOtherOwnersBeenTold: true,
    };
    appeal.appealSiteSection.siteAccess = {
      canInspectorSeeWholeSiteFromPublicRoad: false,
      howIsSiteAccessRestricted: 'There is a moat',
    };
    appeal.appealSiteSection.healthAndSafety = {
      hasIssues: true,
      healthAndSafetyIssues: 'Site was a munitions dump!',
    };
    appeal.sectionStates.aboutYouSection = {
      yourDetails: 'NOT STARTED',
    };
    appeal.sectionStates.requiredDocumentsSection = {
      applicationNumber: 'IN PROGRESS',
      originalApplication: 'COMPLETED',
      decisionLetter: 'NOT STARTED',
    };
    appeal.sectionStates.yourAppealSection = {
      appealStatement: 'IN PROGRESS',
      otherDocuments: 'COMPLETED',
      otherAppeals: 'NOT STARTED',
    };
    appeal.sectionStates.appealSiteSection = {
      siteAccess: 'IN PROGRESS',
      siteOwnership: 'COMPLETED',
      healthAndSafety: 'NOT STARTED',
    };
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
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

  test('PUT /api/v1/appeals/{id} - It responds with an error - missing fields', async () => {
    const appeal = await createAppeal();
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send({});
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain('id is a required field');
    expect(response.body.errors).toContain(
      'sectionStates.aboutYouSection.yourDetails is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.requiredDocumentsSection.applicationNumber is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.requiredDocumentsSection.originalApplication is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.requiredDocumentsSection.decisionLetter is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.yourAppealSection.appealStatement is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.yourAppealSection.otherDocuments is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.yourAppealSection.otherAppeals is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.appealSiteSection.siteAccess is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.appealSiteSection.siteOwnership is a required field'
    );
    expect(response.body.errors).toContain(
      'sectionStates.appealSiteSection.healthAndSafety is a required field'
    );
    expect(response.statusCode).toBe(400);
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

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal cannot be SUBMITTED if any sections are not COMPLETED', async () => {
    const appeal = await createAppeal();
    appeal.state = 'SUBMITTED';
    appeal.sectionStates.aboutYouSection.yourDetails = 'NOT STARTED';
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal state cannot be SUBMITTED if any sections are not COMPLETED'
    );
    expect(response.statusCode).toBe(400);
  });
});
