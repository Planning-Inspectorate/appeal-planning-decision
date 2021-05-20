const index = require('../../src/middleware/index');

const flashMessageCleanup = require('../../src/middleware/flash-message-cleanup');
const flashMessageToNunjucks = require('../../src/middleware/flash-message-to-nunjucks');
const removeUnwantedCookies = require('../../src/middleware/remove-unwanted-cookies');

describe('middleware/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      flashMessageCleanup,
      flashMessageToNunjucks,
      removeUnwantedCookies,
    });
  });
});
