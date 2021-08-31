const fetch = require('node-fetch');
const magicLinkApiWrapper = require('../../../src/lib/magiclink-api-wrapper');

const mockMagicLinkPayload = {};

describe('lib/magiclink-api-wrapper', () => {
  it('should return magic link API response if call was successful', async () => {
    const mockMagicLinkAPIResponse = { magicLinkUrl: 'testMagicLinkUrl' };
    fetch.mockResponseOnce(JSON.stringify(mockMagicLinkAPIResponse));

    const response = await magicLinkApiWrapper.createMagicLink(mockMagicLinkPayload);

    expect(response).toEqual(mockMagicLinkAPIResponse);
  });

  it('should throw Error if magic link API response contains errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({ errors: 'Invalid payload' }));

    try {
      const response = await magicLinkApiWrapper.createMagicLink(mockMagicLinkPayload);
      expect(response).not.toExist();
    } catch (err) {
      expect(err.message).toContain('Magic link request error.');
    }
  });

  it('should throw Error if magic link API is down', async () => {
    fetch.mockRejectedValueOnce('API is down');

    try {
      const response = await magicLinkApiWrapper.createMagicLink(mockMagicLinkPayload);
      expect(response).not.toExist();
    } catch (err) {
      expect(err).toEqual('API is down');
    }
  });
});
