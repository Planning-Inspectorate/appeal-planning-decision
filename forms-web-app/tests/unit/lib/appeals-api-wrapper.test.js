jest.mock('uuid');

const fetch = require('node-fetch');
const uuid = require('uuid');
const {
  createOrUpdateAppeal,
  getExistingAppeal,
  getLPAList,
} = require('../../../src/lib/appeals-api-wrapper');

const config = require('../../../src/config');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    warn: mockLogger,
  }),
}));

config.appeals.url = 'http://fake.url';

describe('lib/appeals-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.doMock();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createOrUpdateAppeal', () => {
    [
      {
        title: 'POST when a uuid is missing',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ good: 'data' }));

          return {
            a: 'b',
            uuid: undefined,
          };
        },
        expected: (appealsApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/appeals`, {
            body: '{"a":"b"}',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': uuid.v4(),
            },
            method: 'POST',
          });
          expect(appealsApiResponse).toEqual({ good: 'data' });
        },
      },
      {
        title: 'PUT when a uuid is provided',
        given: () => {
          fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));

          return {
            c: 'd',
            uuid: '123-abc',
          };
        },
        expected: (appealsApiResponse) => {
          expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/appeals/123-abc`, {
            body: '{"c":"d","uuid":"123-abc"}',
            headers: {
              'Content-Type': 'application/json',
              'X-Correlation-ID': uuid.v4(),
            },
            method: 'PUT',
          });
          expect(appealsApiResponse).toEqual({ shouldBe: 'valid' });
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should ${title}`, async () => {
        const appealsApiResponse = await createOrUpdateAppeal(given());
        expected(appealsApiResponse);
      });
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ something: 'went wrong' }), { status: 400 });

      /**
       * Non-standard way to handle functions that throw in Jest.
       * I believe this is because of `utils.promiseTimout`.
       */
      try {
        await createOrUpdateAppeal({
          a: 'b',
        });
      } catch (e) {
        expect(e.toString()).toEqual('Error: Bad Request');
      }
    });
  });

  describe('getExistingAppeal', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getExistingAppeal('123');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/appeals/123');
    });
  });

  describe('getLPAList', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getLPAList();
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/local-planning-authorities');
    });
  });
});
