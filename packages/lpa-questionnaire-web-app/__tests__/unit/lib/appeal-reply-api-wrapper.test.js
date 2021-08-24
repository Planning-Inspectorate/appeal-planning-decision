require('jest-fetch-mock').enableMocks();

jest.mock('uuid');

const fetch = require('node-fetch');
const uuid = require('uuid');
const {
  createOrUpdateAppealReply,
  getExistingAppealReply,
  getAppealReplyByAppeal,
} = require('../../../src/lib/appeal-reply-api-wrapper');

const config = require('../../../src/config');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    warn: mockLogger,
  }),
}));

config.appealReply.url = 'http://fake.url';

describe('lib/appeal-reply-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.doMock();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createOrUpdateAppealReply', () => {
    [
      {
        title: 'POST when a id is missing',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ good: 'data' }));

          return {
            a: 'b',
            id: undefined,
          };
        },
        expected: (appealReplyApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appealReply.url}/api/v1/reply`, {
            body: '{"a":"b"}',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': uuid.v4(),
            },
            method: 'POST',
          });
          expect(appealReplyApiResponse).toEqual({ good: 'data' });
        },
      },
      {
        title: 'PUT when a id is provided',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));

          return {
            c: 'd',
            id: '123-abc',
          };
        },
        expected: (appealReplyApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appealReply.url}/api/v1/reply/123-abc`, {
            body: '{"c":"d","id":"123-abc"}',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': uuid.v4(),
            },
            method: 'PUT',
          });
          expect(appealReplyApiResponse).toEqual({ shouldBe: 'valid' });
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should ${title}`, async () => {
        const appealReplyApiResponse = await createOrUpdateAppealReply(given());
        expected(appealReplyApiResponse);
      });
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
        status: 400,
      });

      try {
        await createOrUpdateAppealReply({
          a: 'b',
        });
      } catch (e) {
        expect(e.toString()).toEqual('Error: something went wrong');
      }
    });
  });

  describe('getExistingAppealReply', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getExistingAppealReply('123');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/reply/123');
    });
  });

  describe('getAppealReplyByAppeal', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getAppealReplyByAppeal('123');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/reply/appeal/123');
    });
  });
});
