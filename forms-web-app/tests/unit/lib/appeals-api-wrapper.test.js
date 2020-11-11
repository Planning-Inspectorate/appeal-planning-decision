const fetch = require('node-fetch');
const { appealsApi } = require('../../../src/lib/appeals-api-wrapper');
const config = require('../../../src/config');

config.APPEALS_SERVICE_API_URL = 'http://fake.url';

describe('lib/appeals-api-wrapper', () => {
  [
    {
      title: 'POST when a uuid is missing',
      given: () => {
        fetch.mockResponseOnce(JSON.stringify({ good: 'data' }));

        return {
          body: {
            a: 'b',
          },
          uuid: undefined,
        };
      },
      expected: (appealsApiResponse) => {
        expect(fetch).toHaveBeenCalledWith(`${config.APPEALS_SERVICE_API_URL}/appeals`, {
          body: '{"a":"b"}',
          headers: { 'Content-Type': 'application/json' },
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
          body: {
            c: 'd',
          },
          uuid: '123-abc',
        };
      },
      expected: (appealsApiResponse) => {
        expect(fetch).toHaveBeenCalledWith(`${config.APPEALS_SERVICE_API_URL}/appeals/123-abc`, {
          body: '{"c":"d"}',
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
        });
        expect(appealsApiResponse).toEqual({ shouldBe: 'valid' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(`should ${title}`, async () => {
      const { body, uuid } = given();
      const appealsApiResponse = await appealsApi(body, uuid);
      expected(appealsApiResponse);
    });
  });
});
