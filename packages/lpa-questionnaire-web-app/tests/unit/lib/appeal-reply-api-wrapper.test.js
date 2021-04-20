const fetch = require('node-fetch');

const {
  createAppealReply,
  updateAppealReply,
  getExistingAppealReply,
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

  describe('createAppealReply', () => {
    [
      {
        title: 'POST when a id is missing',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ reply: {good: 'data' }}));
        },
        expected: (appealReplyApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appealReply.url}/api/v1/reply`, {
            body: {appealId: expect.any(String)},
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': expect.any(String),
            },
            method: 'POST',
          });
          expect(appealReplyApiResponse).toEqual({ good: 'data' });
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should ${title}`, async () => {
        given();
        const appealReplyApiResponse = await createAppealReply();
        expected(appealReplyApiResponse);
      });
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
        status: 400,
      });

      try {
        await createAppealReply({
          a: 'b',
        });
      } catch (e) {
        expect(e.toString()).toEqual('Error: something went wrong');
      }
    });
  });

  describe('updateAppealReply', () => {
    [
      {
        title: 'PUT when a id is provided',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ reply: { shouldBe: 'valid' }}));
          return {
            appealId: "123-abc"
          }
        },
        expected: (appealReplyApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appealReply.url}/api/v1/reply/123-abc`, {
            body: '{"appealId":"123-abc"}',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': expect.any(String),
            },
            method: 'PUT',
          });
          expect(appealReplyApiResponse).toEqual({ shouldBe: 'valid' });
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should ${title}`, async () => {
        const appealReplyApiResponse = await updateAppealReply(given());
        expected(appealReplyApiResponse);
      });
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
        status: 400,
      });

      try {
        await updateAppealReply({
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
});
