const logger = require('../lib/logger');

describe('Pdf API', () => {
  test('POST /api/v1/pdf - Valid html file - It responds with a pdf file', async () => {
    logger.debug('Hitting the valid html file JEST test...');
  });

  test('POST /api/v1/pdf - Invalid html file - It responds with an error', async () => {
    logger.debug('Hitting the invalid html file JEST test...');
  });
});
