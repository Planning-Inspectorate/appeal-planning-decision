require('express-async-errors');

jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
  const mock = {
    reset: jest.fn(() => mock),
    setNotifyClient: jest.fn(() => mock),
    setTemplateId: jest.fn(() => mock),
    setTemplateVariable: jest.fn(() => mock),
    setTemplateVariablesFromObject: jest.fn(() => mock),
    addFileToTemplateVariables: jest.fn(() => mock),
    setDestinationEmailAddress: jest.fn(() => mock),
    setEmailReplyToId: jest.fn(() => mock),
    setReference: jest.fn(() => mock),
    sendEmail: jest.fn(() => Promise.resolve('done')),
  };
  return mock;
});

const request = require('supertest');
const app = require('../../src/app');
const magicLinkJsonData = require('../resources/magicLinkData.json');

describe('magiclink-auth-service-api - integration tests', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(1629300347);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Successful authentication flow with magic link', () => {
    let magicLinkToken;
    describe('POST /magiclink', () => {
      it('should respond with magic link url', async () => {
        const response = await request(app).post('/magiclink').send(magicLinkJsonData);

        const { magicLink } = response.body;
        // eslint-disable-next-line prefer-destructuring
        magicLinkToken = magicLink.split('magiclink/')[1];
        expect(response.statusCode).toBe(201);
      });
    });

    describe('GET /magiclink/:magiclink', () => {
      it('should create a JWT cookie', async () => {
        const response = await request(app).get(`/magiclink/${magicLinkToken}`);

        expect(response.headers['set-cookie']).toEqual([
          'authCookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiZW1haWwiOiJ0ZXN0LmFkZHJlc3NAcGxhbm5pbmdpbnNwZWN0b3JhdGUuZ292LnVrIiwibHBhQ29kZSI6IkU2OTk5OTk5OSJ9LCJleHAiOjE2Mjk3MDAzNDcsImlhdCI6MTYyOTMwMH0.NsevUdME4Q3iCwRbTCcwPUiNVuTCHa81uz1B8v60_3A; Path=/; Expires=Tue, 20 Jan 1970 04:35:00 GMT; HttpOnly',
        ]);
        expect(response.statusCode).toBe(302);
      });
    });
  });
});
