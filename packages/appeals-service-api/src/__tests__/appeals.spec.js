const request = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const mongodb = require('../db/db');
const app = require('../app');
const { appealDocument } = require('../models/appeal');

jest.mock('../db/db');
jest.mock('../lib/queue');

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
    appeal.lpaCode = 'E60000281/new';
    appeal.decisionDate = '2020-10-29T12:00:00.000Z';
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
    appeal.yourAppealSection.otherDocuments.uploadedFiles = [
      {
        name: 'my_uploaded_file_other_documents_one.pdf',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
      {
        name: 'my_uploaded_fileother_documents_two.pdf',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    ];
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
    };
    appeal.sectionStates.appealSiteSection = {
      siteAccess: 'IN PROGRESS',
      siteOwnership: 'COMPLETED',
      healthAndSafety: 'NOT STARTED',
    };
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
      'The appeal state cannot be SUBMITTED if any sections except Other Documents are not COMPLETED'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Cannot update appeal that is already SUBMITTED', async () => {
    const appeal = await createAppeal();
    appeal.lpaCode = 'E60000281/new';
    appeal.decisionDate = '2020-10-29T12:00:00.000Z';
    appeal.state = 'SUBMITTED';
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
    appeal.yourAppealSection.otherDocuments.uploadedFiles = [
      {
        name: 'my_uploaded_file_other_documents_one.pdf',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
      {
        name: 'my_uploaded_fileother_documents_two.pdf',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    ];
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
      yourDetails: 'COMPLETED',
    };
    appeal.sectionStates.requiredDocumentsSection = {
      applicationNumber: 'COMPLETED',
      originalApplication: 'COMPLETED',
      decisionLetter: 'COMPLETED',
    };
    appeal.sectionStates.yourAppealSection = {
      appealStatement: 'COMPLETED',
      otherDocuments: 'COMPLETED',
    };
    appeal.sectionStates.appealSiteSection = {
      siteAccess: 'COMPLETED',
      siteOwnership: 'COMPLETED',
      healthAndSafety: 'COMPLETED',
    };
    appeal.state = 'SUBMITTED';
    await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(409);
    expect(response.body.errors).toContain('Cannot update appeal that is already SUBMITTED');
    expect(response.statusCode).toBe(409);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Appeal appellant name must be valued if email is.', async () => {
    const appeal = await createAppeal();

    appeal.aboutYouSection.yourDetails.email = 'jim@john.com';
    appeal.aboutYouSection.yourDetails.name = '';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal appellant details must have email and name valued.The name is missing.'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Appeal appellant email must be valued if name is.', async () => {
    const appeal = await createAppeal();

    appeal.aboutYouSection.yourDetails.email = '';
    appeal.aboutYouSection.yourDetails.name = 'Jim John';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal appellant details must have email and name valued.The email is missing.'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal statement upload file cannot have name without id', async () => {
    const appeal = await createAppeal();
    appeal.yourAppealSection.appealStatement.uploadedFile.name =
      'my_uploaded_file_appeal_statement.pdf';
    appeal.yourAppealSection.appealStatement.uploadedFile.id = null;
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal statement uploaded file must have an id for the file when it has a name'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal statement upload file cannot have id without name', async () => {
    const appeal = await createAppeal();
    appeal.yourAppealSection.appealStatement.uploadedFile.name = '';
    appeal.yourAppealSection.appealStatement.uploadedFile.id =
      '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal statement uploaded file must have a name for the file when it has an id'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal statement upload file cannot have sensitive information', async () => {
    const appeal = await createAppeal();
    appeal.yourAppealSection.appealStatement.uploadedFile.name =
      'my_uploaded_file_appeal_statement.pdf';
    appeal.yourAppealSection.appealStatement.uploadedFile.id =
      '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    appeal.yourAppealSection.appealStatement.hasSensitiveInformation = true;
    const response1 = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response1.body.code).toEqual(400);
    expect(response1.body.errors).toContain(
      'The appeal statement uploaded file cannot be accepted unless it is confirmed to have no sensitive information'
    );
    expect(response1.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - appeal statement upload file must include answer to sensitive information question', async () => {
    const appeal = await createAppeal();
    appeal.yourAppealSection.appealStatement.uploadedFile.name =
      'my_uploaded_file_appeal_statement.pdf';
    appeal.yourAppealSection.appealStatement.uploadedFile.id =
      '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    appeal.yourAppealSection.appealStatement.hasSensitiveInformation = null;
    const response1 = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response1.body.code).toEqual(400);
    expect(response1.body.errors).toContain(
      'The appeal statement uploaded file cannot be accepted unless it is confirmed to have no sensitive information'
    );
    expect(response1.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - supporting document files should have both id and names', async () => {
    const appeal = await createAppeal();

    appeal.yourAppealSection.otherDocuments.uploadedFiles = [
      { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'filename-1' },
      { id: null, name: 'filename-2' },
      { id: '3fa85f64-5717-4562-b3fc-2c963f66afa8', name: '' },
    ];

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The supporting document must have id and name valued.The id is missing. name=filename-2'
    );
    expect(response.body.errors).toContain(
      'The supporting document must have id and name valued.The name is missing. id=3fa85f64-5717-4562-b3fc-2c963f66afa8'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - original planning application upload file cannot have name without id', async () => {
    const appeal = await createAppeal();
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.name =
      'my_uploaded_file_planning_application.pdf';
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.id = null;
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The planning application uploaded file must have an id for the file when it has a name'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - original planning application upload file cannot have id without name', async () => {
    const appeal = await createAppeal();
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.name = '';
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.id =
      '3fa85f64-5717-4562-b3fc-2c963f66afa7';
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The planning application uploaded file must have a name for the file when it has an id'
    );
    expect(response.statusCode).toBe(400);
  });
  test('PUT /api/v1/appeals/{id} - It responds with an error - decision letter upload file cannot have name without id', async () => {
    const appeal = await createAppeal();
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name =
      'my_uploaded_file_planning_application.pdf';
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id = null;
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The decision letter uploaded file must have an id for the file when it has a name'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - decision letter upload file cannot have id without name', async () => {
    const appeal = await createAppeal();
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name = '';
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id =
      '3fa85f64-5717-4562-b3fc-2c963f66afa7';
    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The decision letter uploaded file must have a name for the file when it has an id'
    );
    expect(response.statusCode).toBe(400);
  });

  [
    {
      addressLine1: '',
      county: 'county',
      postcode: 'postcode',
    },
    {
      addressLine1: 'addressLine1',
      county: '',
      postcode: 'postcode',
    },
    {
      addressLine1: 'addressLine1',
      county: 'county',
      postcode: '',
    },
  ].forEach((siteAddress) => {
    test('PUT /api/v1/appeals/{id} - It responds with an error - the site address should see all its mandatory fields valued or none of them, other it should fail', async () => {
      const appeal = await createAppeal();
      appeal.appealSiteSection.siteAddress = siteAddress;

      const siteAddressErrorMessage = `The appeal appellant site address must have addressLine1, county and postcode valued.
    addressLine1=${appeal.appealSiteSection.siteAddress.addressLine1}
    county=${appeal.appealSiteSection.siteAddress.county}
    postcode=${appeal.appealSiteSection.siteAddress.postcode}`;

      const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
      expect(response.body.code).toEqual(400);
      expect(response.body.errors).toContain(siteAddressErrorMessage);
      expect(response.statusCode).toBe(400);
    });
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - the appellant owning the whole site but still told other owners should fail', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.siteOwnership.ownsWholeSite = true;
    appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = true;

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If the appellant owns the whole appeal site there can be no other owners'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - other owner told without knowing if there is any should fail', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = true;
    appeal.appealSiteSection.siteOwnership.ownsWholeSite = null;

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'We should know if there is another owners before knowing if they were told'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - the health and safety has issues and they should be provided', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.healthAndSafety.hasIssues = true;
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = '';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If the health and safety task has issues, they need to be valued'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - the health and safety has no issues and they should not be provided', async () => {
    const appeal = await createAppeal();
    appeal.appealSiteSection.healthAndSafety.hasIssues = false;
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = 'Some issues';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'The appeal does not states that there is health and safety issues but the field is valued'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - If appeal site is visible from the public road then site access restrictions is not required', async () => {
    const appeal = await createAppeal();

    appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = true;
    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'Big gaping hole';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If appeal site is visible from the public road then site access restrictions is not required'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - If appeal site is not visible from the public road then site access restrictions is required', async () => {
    const appeal = await createAppeal();

    appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = false;

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If appeal site is not visible from the public road then site access restrictions is required'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - If appeal site from public road is null then site access restrictions must be null or empty', async () => {
    const appeal = await createAppeal();

    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'Big gaping hole';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If appeal site from public road is null then site access restrictions must be null or empty'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Appeal has been entered by agent acting on behalf of applicant and must have an Appealing on Behalf Applicant Name', async () => {
    const appeal = await createAppeal();

    appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
    appeal.aboutYouSection.yourDetails.isOriginalApplicant = false;

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'Appeal has been entered by agent acting on behalf of applicant and must have an Appealing on Behalf Applicant Name'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Appellant name cannot be empty and must be specified', async () => {
    const appeal = await createAppeal();

    appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
    appeal.sectionStates.aboutYouSection.name = '';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If your details section is completed then appellant name cannot be null or empty and it must be specified'
    );
    expect(response.statusCode).toBe(400);
  });

  test('PUT /api/v1/appeals/{id} - It responds with an error - Appellant email address cannot be empty and must be specified', async () => {
    const appeal = await createAppeal();

    appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
    appeal.sectionStates.aboutYouSection.email = '';

    const response = await request(app).put(`/api/v1/appeals/${appeal.id}`).send(appeal);
    expect(response.body.code).toEqual(400);
    expect(response.body.errors).toContain(
      'If your details section is completed then appellant email address cannot be null or empty and it must be specified'
    );
    expect(response.statusCode).toBe(400);
  });
});
